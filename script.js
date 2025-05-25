// script.js

document.addEventListener('DOMContentLoaded', () => {
    const postsListContainer = document.getElementById('posts-list');
    const postContentContainer = document.getElementById('post-content');
    const postTitleDateContainer = document.getElementById('post-title-date');
    const siteTitleElements = document.querySelectorAll('.site-title a'); // For updating site title if needed

    // --- Configuration ---
    const postsJsonPath = 'posts.json';
    const defaultSiteTitle = "buriburiza3mon's Blog"; // Used if not customized elsewhere

    // Function to update site title in header and document title
    function updateTitles(pageTitle, postSpecificTitle = null) {
        const finalTitle = postSpecificTitle ? `${postSpecificTitle} - ${pageTitle}` : pageTitle;
        document.title = finalTitle;
        siteTitleElements.forEach(el => el.textContent = pageTitle);
    }
    
    // Call updateTitles with the default title initially for both pages
    // The post page will override this if a specific post is loaded
    updateTitles(defaultSiteTitle);


    // --- Logic for index.html (listing posts) ---
    if (postsListContainer) {
        const loadingIndicator = document.getElementById('loading-indicator');

        async function fetchAndDisplayPosts() {
            try {
                const response = await fetch(postsJsonPath);
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status} - Could not load ${postsJsonPath}`);
                }
                const posts = await response.json();

                if (!Array.isArray(posts)) {
                    throw new Error(`${postsJsonPath} does not contain a valid JSON array.`);
                }
                
                // Sort posts by date, newest first
                posts.sort((a, b) => new Date(b.date) - new Date(a.date));

                if (posts.length === 0) {
                    postsListContainer.innerHTML = '<p class="text-neutral-400">No posts yet. Stay tuned!</p>';
                } else {
                    postsListContainer.innerHTML = ''; // Clear previous content (like loading)
                    posts.forEach(post => {
                        const postElement = document.createElement('article');
                        postElement.className = 'bg-neutral-800 p-6 rounded-lg shadow-lg transform transition-all duration-300 hover:scale-105';
                        
                        // Sanitize inputs (simple example, for more complex scenarios consider a dedicated library)
                        const title = post.title || 'Untitled Post';
                        const date = post.date ? new Date(post.date).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' }) : 'No date';
                        const author = post.author || 'Anonymous';
                        const snippet = post.snippet || 'No snippet available.';
                        const slug = post.slug || '#';

                        postElement.innerHTML = `
                            <h3 class="text-2xl font-bold mb-2">
                                <a href="post.html?id=${encodeURIComponent(slug)}" class="text-sky-400 hover:text-sky-300 transition-colors duration-200">${title}</a>
                            </h3>
                            <p class="text-sm text-neutral-400 mb-1">Published on: ${date}</p>
                            <p class="text-sm text-neutral-500 mb-3">By: ${author}</p>
                            <p class="text-neutral-300 leading-relaxed">${snippet}</p>
                            <a href="post.html?id=${encodeURIComponent(slug)}" class="inline-block mt-4 text-sky-500 hover:text-sky-400 font-semibold transition-colors duration-200">Read more &rarr;</a>
                        `;
                        postsListContainer.appendChild(postElement);
                    });
                }
            } catch (error) {
                console.error('Error fetching or displaying posts:', error);
                postsListContainer.innerHTML = `<p class="text-red-400">Error loading posts. Please check the console for details or ensure 'posts.json' is correctly formatted and accessible.</p>`;
            } finally {
                if(loadingIndicator) loadingIndicator.style.display = 'none';
            }
        }
        fetchAndDisplayPosts();
    }

    // --- Logic for post.html (displaying a single post) ---
    if (postContentContainer && postTitleDateContainer) {
        const postLoadingIndicator = document.getElementById('post-loading-indicator');
        const postNotFoundMessage = document.getElementById('post-not-found');
        const postContentOuterContainer = document.getElementById('post-content-container');


        async function fetchAndDisplaySinglePost() {
            const urlParams = new URLSearchParams(window.location.search);
            const postId = urlParams.get('id');

            if (!postId) {
                postContentContainer.innerHTML = '<p class="text-red-400">No post ID specified in the URL.</p>';
                if(postLoadingIndicator) postLoadingIndicator.style.display = 'none';
                if(postNotFoundMessage) postNotFoundMessage.classList.remove('hidden');
                return;
            }

            try {
                const response = await fetch(postsJsonPath);
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status} - Could not load ${postsJsonPath}`);
                }
                const allPosts = await response.json();
                if (!Array.isArray(allPosts)) {
                    throw new Error(`${postsJsonPath} does not contain a valid JSON array.`);
                }

                const postData = allPosts.find(p => p.slug === postId);

                if (!postData) {
                    throw new Error(`Post with ID '${postId}' not found in ${postsJsonPath}.`);
                }

                // Update page and site title
                const postTitle = postData.title || 'Untitled Post';
                updateTitles(defaultSiteTitle, postTitle); // Update document title and header title

                // Display title and date
                const date = postData.date ? new Date(postData.date).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' }) : 'No date';
                const author = postData.author || 'Anonymous';
                postTitleDateContainer.innerHTML = `
                    <h2 class="text-3xl sm:text-4xl font-bold text-white mb-2">${postTitle}</h2>
                    <p class="text-sm text-neutral-400">Published on: ${date} by ${author}</p>
                `;

                // Fetch and render Markdown content
                if (postData.markdownFile) {
                    const mdResponse = await fetch(postData.markdownFile);
                    if (!mdResponse.ok) {
                        throw new Error(`HTTP error! status: ${mdResponse.status} - Could not load Markdown file: ${postData.markdownFile}`);
                    }
                    const markdownText = await mdResponse.text();
                    // Ensure marked is loaded
                    if (typeof marked === 'undefined') {
                        throw new Error('marked.js library is not loaded.');
                    }
                    postContentContainer.innerHTML = marked.parse(markdownText);
                } else {
                    postContentContainer.innerHTML = '<p class="text-neutral-400">No content file specified for this post.</p>';
                }

            } catch (error) {
                console.error('Error fetching or displaying post:', error);
                postTitleDateContainer.innerHTML = ''; // Clear any partial title/date
                postContentContainer.innerHTML = ''; // Clear any partial content
                if(postNotFoundMessage) postNotFoundMessage.classList.remove('hidden');
                if(postContentOuterContainer) postContentOuterContainer.classList.add('text-center'); // Center the error message
                 updateTitles(defaultSiteTitle, "Post Not Found");
            } finally {
                 if(postLoadingIndicator) postLoadingIndicator.style.display = 'none';
            }
        }
        fetchAndDisplaySinglePost();
    }
});
