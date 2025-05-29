// script.js
document.addEventListener('DOMContentLoaded', () => {
    const htmlElement = document.documentElement;
    const postsJsonPath = 'posts.json';
    const defaultSiteTitle = "buriburiza3mon's Blog";
    let allFetchedPosts = []; // To store all posts for searching

    // --- THEME TOGGLE ---
    const themeToggleButtons = document.querySelectorAll('#theme-toggle');
    const sunIcons = document.querySelectorAll('#theme-icon-sun');
    const moonIcons = document.querySelectorAll('#theme-icon-moon');

    // Function to apply the theme and update the button icon
    function applyThemeAndIcon(theme) {
        if (theme === 'dark') {
            htmlElement.classList.add('dark');
            sunIcons.forEach(icon => icon.classList.remove('hidden')); // Show sun icon (click to go light)
            moonIcons.forEach(icon => icon.classList.add('hidden'));
        } else { // theme === 'light'
            htmlElement.classList.remove('dark');
            sunIcons.forEach(icon => icon.classList.add('hidden'));
            moonIcons.forEach(icon => icon.classList.remove('hidden')); // Show moon icon (click to go dark)
        }
    }

    // Initial theme setup:
    // Default to light mode unless a theme was explicitly set by the user and stored.
    const userSetTheme = localStorage.getItem('theme');
    if (userSetTheme) {
        applyThemeAndIcon(userSetTheme); // Apply user's last explicitly set theme
    } else {
        applyThemeAndIcon('light'); // Default to light mode if no user preference is stored
    }

    themeToggleButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            // Determine the new theme: if 'dark' is currently present, the new theme will be 'light', and vice versa.
            const newTheme = htmlElement.classList.contains('dark') ? 'light' : 'dark';
            localStorage.setItem('theme', newTheme); // Save the user's explicit choice
            applyThemeAndIcon(newTheme);
        });
    });
    
    // --- SITE TITLE (from previous version) ---
    const siteTitleElements = document.querySelectorAll('.site-title a');
    function updateSiteTitles(pageTitle, postSpecificTitle = null) {
        const finalTitle = postSpecificTitle ? `${postSpecificTitle} - ${pageTitle}` : pageTitle;
        document.title = finalTitle;
    }
    updateSiteTitles(defaultSiteTitle);


    // --- INDEX PAGE SPECIFIC LOGIC ---
    const postsListContainer = document.getElementById('posts-list');
    if (postsListContainer) {
        const loadingIndicator = document.getElementById('loading-indicator');
        const noResultsMessage = document.getElementById('no-results-message');
        const searchResultsCount = document.getElementById('search-results-count');
        
        const searchInputHeader = document.getElementById('search-input-header');
        const searchClearHeader = document.getElementById('search-clear-header');
        const searchInputMain = document.getElementById('search-input-main');
        const searchClearMain = document.getElementById('search-clear-main');

        function displayPosts(postsToDisplay) {
            postsListContainer.innerHTML = ''; 
            if (postsToDisplay.length === 0 && ( (searchInputHeader && searchInputHeader.value) || (searchInputMain && searchInputMain.value) ) ) {
                noResultsMessage.classList.remove('hidden');
            } else {
                noResultsMessage.classList.add('hidden');
            }
            
            if (postsToDisplay.length === 0 && !( (searchInputHeader && searchInputHeader.value) || (searchInputMain && searchInputMain.value) ) ) {
                 // If no posts at all and not searching, show a generic "no posts yet"
                postsListContainer.innerHTML = '<p class="text-neutral-500 dark:text-neutral-400">No posts yet. Stay tuned!</p>';
            } else {
                 postsToDisplay.forEach(post => {
                    const postElement = document.createElement('article');
                    postElement.className = 'bg-neutral-50 dark:bg-neutral-800 p-6 rounded-lg shadow-lg transform transition-all duration-300 hover:scale-[1.02] border border-neutral-200 dark:border-neutral-700';
                    
                    const title = post.title || 'Untitled Post';
                    const date = post.date ? new Date(post.date).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' }) : 'No date';
                    const author = post.author || 'Anonymous';
                    const snippet = post.snippet || 'No snippet available.';
                    const slug = post.slug || '#';

                    postElement.innerHTML = `
                        <h3 class="text-2xl font-bold mb-2">
                            <a href="post.html?id=${encodeURIComponent(slug)}" class="text-sky-600 dark:text-sky-400 hover:underline transition-colors duration-200">${title}</a>
                        </h3>
                        <p class="text-sm text-neutral-500 dark:text-neutral-400 mb-1">Published on: ${date}</p>
                        <p class="text-sm text-neutral-500 dark:text-neutral-400 mb-3">By: ${author}</p>
                        <p class="text-neutral-700 dark:text-neutral-300 leading-relaxed">${snippet}</p>
                        <a href="post.html?id=${encodeURIComponent(slug)}" class="inline-block mt-4 text-sky-600 dark:text-sky-500 hover:text-sky-500 dark:hover:text-sky-400 font-semibold transition-colors duration-200">Read more &rarr;</a>
                    `;
                    postsListContainer.appendChild(postElement);
                });
            }

            if (searchResultsCount) {
                if ((searchInputHeader && searchInputHeader.value) || (searchInputMain && searchInputMain.value)) {
                    searchResultsCount.textContent = `${postsToDisplay.length} post(s) found.`;
                } else {
                    searchResultsCount.textContent = ''; // Clear count if not searching
                }
            }
        }

        function handleSearch(searchTerm) {
            const lowerCaseTerm = searchTerm.toLowerCase().trim();
            if (loadingIndicator) loadingIndicator.style.display = 'none';

            if (!lowerCaseTerm) {
                displayPosts(allFetchedPosts); 
                if(searchResultsCount) searchResultsCount.textContent = '';
                return;
            }

            const filteredPosts = allFetchedPosts.filter(post => {
                return (post.title && post.title.toLowerCase().includes(lowerCaseTerm)) ||
                       (post.snippet && post.snippet.toLowerCase().includes(lowerCaseTerm)) ||
                       (post.author && post.author.toLowerCase().includes(lowerCaseTerm)); 
            });
            displayPosts(filteredPosts);
        }
        
        async function fetchAndPreparePosts() {
            try {
                const response = await fetch(postsJsonPath);
                if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
                const posts = await response.json();
                if (!Array.isArray(posts)) throw new Error(`${postsJsonPath} is not a valid JSON array.`);
                
                allFetchedPosts = posts.sort((a, b) => new Date(b.date) - new Date(a.date));
                
                const urlParams = new URLSearchParams(window.location.search);
                const searchQueryFromUrl = urlParams.get('search');

                if (searchQueryFromUrl) {
                    if(searchInputHeader) searchInputHeader.value = searchQueryFromUrl;
                    if(searchInputMain) searchInputMain.value = searchQueryFromUrl;
                    handleSearch(searchQueryFromUrl);
                    if(searchInputHeader && searchClearHeader) searchClearHeader.classList.toggle('hidden', !searchQueryFromUrl);
                    if(searchInputMain && searchClearMain) searchClearMain.classList.toggle('hidden', !searchQueryFromUrl);
                } else {
                    displayPosts(allFetchedPosts);
                }

            } catch (error) {
                console.error('Error fetching or displaying posts:', error);
                postsListContainer.innerHTML = `<p class="text-red-500 dark:text-red-400">Error loading posts. Please check console or ensure 'posts.json' is correct.</p>`;
                if (searchResultsCount) searchResultsCount.textContent = '';
            } finally {
                if (loadingIndicator) loadingIndicator.style.display = 'none';
            }
        }
        fetchAndPreparePosts();

        function setupSearchInput(inputElement, clearButtonElement) {
            if (!inputElement) return;
            inputElement.addEventListener('keyup', (e) => {
                const searchTerm = e.target.value;
                handleSearch(searchTerm);
                if(clearButtonElement) clearButtonElement.classList.toggle('hidden', !searchTerm);
                if (inputElement === searchInputHeader && searchInputMain) searchInputMain.value = searchTerm;
                if (inputElement === searchInputMain && searchInputHeader) searchInputHeader.value = searchTerm;
            });
            if (clearButtonElement) {
                clearButtonElement.addEventListener('click', () => {
                    inputElement.value = '';
                    handleSearch('');
                    clearButtonElement.classList.add('hidden');
                    if (inputElement === searchInputHeader && searchInputMain) { searchInputMain.value = ''; if(searchClearMain) searchClearMain.classList.add('hidden'); }
                    if (inputElement === searchInputMain && searchInputHeader) { searchInputHeader.value = ''; if(searchClearHeader) searchClearHeader.classList.add('hidden'); }
                    inputElement.focus();
                });
            }
        }
        setupSearchInput(searchInputHeader, searchClearHeader);
        setupSearchInput(searchInputMain, searchClearMain);
    }


    // --- POST PAGE SPECIFIC LOGIC ---
    const postContentContainer = document.getElementById('post-content');
    const postTitleDateContainer = document.getElementById('post-title-date');
    if (postContentContainer && postTitleDateContainer) {
        const postLoadingIndicator = document.getElementById('post-loading-indicator');
        const postNotFoundMessage = document.getElementById('post-not-found');
        const postContentOuterContainer = document.getElementById('post-content-container');

        async function fetchAndDisplaySinglePost() {
            const urlParams = new URLSearchParams(window.location.search);
            const postId = urlParams.get('id');

            if (!postId) {
                if(postLoadingIndicator) postLoadingIndicator.style.display = 'none';
                if(postNotFoundMessage) postNotFoundMessage.classList.remove('hidden');
                updateSiteTitles(defaultSiteTitle, "Post Not Found");
                return;
            }

            try {
                const response = await fetch(postsJsonPath);
                if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
                const allPostsData = await response.json();
                if (!Array.isArray(allPostsData)) throw new Error(`${postsJsonPath} is not a valid JSON array.`);
                
                const postData = allPostsData.find(p => p.slug === postId);
                if (!postData) throw new Error(`Post with ID '${postId}' not found.`);

                const postTitle = postData.title || 'Untitled Post';
                updateSiteTitles(defaultSiteTitle, postTitle);

                const date = postData.date ? new Date(postData.date).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' }) : 'No date';
                const author = postData.author || 'Anonymous';
                postTitleDateContainer.innerHTML = `
                    <h2 class="text-3xl sm:text-4xl font-bold text-neutral-900 dark:text-white mb-2">${postTitle}</h2>
                    <p class="text-sm text-neutral-600 dark:text-neutral-400">Published on: ${date} by ${author}</p>
                `;

                if (postData.markdownFile) {
                    const mdResponse = await fetch(postData.markdownFile);
                    if (!mdResponse.ok) throw new Error(`Could not load Markdown: ${postData.markdownFile}`);
                    const markdownText = await mdResponse.text();
                    if (typeof marked === 'undefined') throw new Error('marked.js not loaded.');
                    postContentContainer.innerHTML = marked.parse(markdownText);
                } else {
                    postContentContainer.innerHTML = '<p>No content specified.</p>';
                }
            } catch (error) {
                console.error('Error fetching post:', error);
                postTitleDateContainer.innerHTML = '';
                postContentContainer.innerHTML = '';
                if(postNotFoundMessage) postNotFoundMessage.classList.remove('hidden');
                if(postContentOuterContainer) postContentOuterContainer.classList.add('text-center');
                updateSiteTitles(defaultSiteTitle, "Post Not Found");
            } finally {
                if(postLoadingIndicator) postLoadingIndicator.style.display = 'none';
            }
        }
        fetchAndDisplaySinglePost();
        
        const searchInputHeaderPost = document.getElementById('search-input-header-post');
        if(searchInputHeaderPost) {
            searchInputHeaderPost.addEventListener('keypress', function(e) {
                if (e.key === 'Enter' && this.value.trim() !== '') {
                    window.location.href = `index.html?search=${encodeURIComponent(this.value.trim())}`;
                }
            });
        }
    }
});
