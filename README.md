# My Personal Blog - Instructions

Welcome to your new personal blog! This site is designed to be easy for you to update, even if you're not a technical expert.

## File Structure Overview

Your blog is made up of a few key files and folders:

* `index.html`: Your homepage, listing all blog posts.
* `post.html`: The template page that displays individual blog posts.
* `script.js`: The JavaScript that makes the blog work (you usually won't need to touch this).
* `posts.json`: **This is an important file!** It's a list of all your blog posts and their details. You'll edit this to add new posts.
* `/posts/` (folder): This folder is where you'll save your actual blog post content as Markdown (`.md`) files.
* `README.md`: These instructions.

## How to Add a New Blog Post

Follow these steps carefully each time you want to add a new post:

**Step 1: Write Your Blog Post Content**

1.  Open a plain text editor (like Notepad on Windows, TextEdit on Mac in plain text mode, or VS Code if you have it).
2.  Write your blog post using **Markdown**. Markdown is a simple way to format text. Here are some basics:
    * `# Heading 1` (for your main title)
    * `## Heading 2` (for subheadings)
    * `**bold text**`
    * `*italic text*`
    * `[link text](http://example.com)`
    * Lines starting with `* ` or `- ` or `1. ` become lists.
    * Leave a blank line between paragraphs.
    * You can see `welcome-post.md` and `another-post.md` in the `posts` folder for more examples.
3.  Save this file in the `posts/` folder.
    * **Filename:** Use a short, descriptive name with all lowercase letters and hyphens instead of spaces. This name will also be your post's "slug" (its unique ID).
    * **Example:** If your post is titled "My Trip to Japan", you could save the file as `my-trip-to-japan.md`.

**Step 2: Update the `posts.json` File**

1.  Open the `posts.json` file (it's in the main folder of your blog) in your text editor.
2.  This file contains a list of your posts. Each post is enclosed in curly braces `{ }`. Posts are separated by commas. The whole list is inside square brackets `[ ]`.
3.  To add your new post, you'll copy an existing post entry and modify it. **Be very careful with commas and quotes!** JSON is strict.
    * Find an existing post entry (it looks like this):
        ```json
        {
          "slug": "some-old-post-slug",
          "title": "Some Old Post Title",
          "date": "YYYY-MM-DD",
          "author": "Your Name",
          "snippet": "A short description of the old post.",
          "markdownFile": "posts/some-old-post-slug.md"
        }
        ```
    * Copy this entire block (from `{` to `}`).
    * Paste it **after** an existing entry, and **make sure to add a comma `,`** after the closing brace `}` of the entry *before* your new one, IF it's not the last one in the list. If you're adding it to the very end, the *previous last entry* will now need a comma after its `}`. The very last entry in the whole list should NOT have a comma after its `}`.
        * It's often easiest to add new posts at the **beginning** of the list (right after the opening `[`). If you do this, make sure the post you just added has a comma after its closing `}` (unless it's the only post).

    * Now, edit the details for your new post:
        * `"slug"`: This **must exactly match** the filename you chose in Step 1 (but without the `.md` extension). For example, if your file is `my-trip-to-japan.md`, the slug is `"my-trip-to-japan"`.
        * `"title"`: The full title of your blog post, e.g., `"My Amazing Trip to Japan"`.
        * `"date"`: The date you want to display for the post, in `YYYY-MM-DD` format (e.g., `"2025-06-15"`).
        * `"author"`: Your name, e.g., `"buriburiza3mon"`.
        * `"snippet"`: A short (1-2 sentences) summary of your post. This appears on the homepage.
        * `"markdownFile"`: The path to your Markdown file. It will always be `posts/your-slug-name.md`. For example, `"posts/my-trip-to-japan.md"`.

    * **Example of `posts.json` after adding a new post at the beginning:**
        ```json
        [
          {
            "slug": "my-trip-to-japan",  // New post
            "title": "My Amazing Trip to Japan",
            "date": "2025-06-15",
            "author": "buriburiza3mon",
            "snippet": "Recounting my incredible journey through Tokyo and Kyoto.",
            "markdownFile": "posts/my-trip-to-japan.md"
          }, // <-- Note the comma here!
          {
            "slug": "welcome-to-my-blog", // Existing post
            "title": "Welcome to My New Blog!",
            "date": "2025-05-26",
            "author": "buriburiza3mon",
            "snippet": "This is the very first post on my new blog...",
            "markdownFile": "posts/welcome-post.md"
          } // <-- No comma if this is the last one in the list
          // ... more posts might follow
        ]
        ```

4.  Save the `posts.json` file.

**Step 3: Upload to GitHub (if already set up)**

If your site is already on GitHub Pages, you'll need to commit and push these changes (the new `.md` file and the updated `posts.json`) to your GitHub repository.

## Setting Up on GitHub Pages (First Time)

GitHub Pages is a free way to host your static website.

1.  **Create a GitHub Account:** If you don't have one, sign up at [https://github.com/](https://github.com/).
2.  **Create a New Repository:**
    * On GitHub, click the "+" icon in the top right and select "New repository."
    * **Repository name:** This is very important. It **must** be `yourusername.github.io`. For example, if your GitHub username is `buriburiza3mon`, the repository name must be `buriburiza3mon.github.io`.
    * Make sure it's set to "Public".
    * You can add a description if you like.
    * Click "Create repository."
3.  **Upload Your Blog Files:**
    * On your new repository page, click the "Add file" button and then "Upload files."
    * Drag and drop all the files and the `posts` folder (with its content) from your computer into the upload area. This includes:
        * `index.html`
        * `post.html`
        * `script.js`
        * `posts.json`
        * The entire `posts` folder (containing `welcome-post.md`, `another-post.md`, and any new posts you've added).
        * This `README.md` file.
    * Once all files are selected, scroll down and click "Commit changes."
4.  **Wait a Few Minutes:**
    * GitHub Pages will automatically build and deploy your site. This might take a minute or two.
    * Your blog will then be live at `https://yourusername.github.io` (e.g., `https://buriburiza3mon.github.io`).

## Customizing Your Blog Title

If you want to change the main title of your blog (the one that appears in the header and the browser tab):

1.  Open `index.html`.
2.  Find this line (around line 21): `<a href="index.html">buriburiza3mon's Blog</a>`. Change `buriburiza3mon's Blog` to your desired title.
3.  Also, find this line (around line 7): `<title>buriburiza3mon's Blog</title>`. Change the text here too.
4.  Open `post.html`.
5.  Find this line (around line 22): `<a href="index.html">buriburiza3mon's Blog</a>`. Change it.
6.  The `<title>` tag in `post.html` (around line 7) is updated dynamically by `script.js`, but the script uses a default. Open `script.js` and find the line (around line 10): `const defaultSiteTitle = "buriburiza3mon's Blog";`. Change the title here.
7.  Save the files and upload the changes to GitHub.

That's it! Enjoy your new blog. If you get stuck with `posts.json`, online JSON validators can help you find syntax errors.
