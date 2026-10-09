const defaultPosts = [
    {
        id: 1001,
        author: "Daniel",
        title: "Welcome to MyBlog! 🎉",
        content: "Welcome to our community! This is a place to share ideas, discover interesting stories, and connect with people. Like, comment, react, and repost your favourite posts. What would you like to talk about today?",
        date: "Oct 9, 2026",
        likes: 24,
        liked: false,
        reactions: {
            "👍": 12,
            "❤️": 18,
            "😂": 4,
            "😮": 2,
            "😢": 0
        },
        comments: [
            { author: "Sarah", text: "I love the idea! Happy to be here.", date: "Oct 9, 2026" },
            { author: "Michael", text: "Looking forward to sharing my thoughts.", date: "Oct 9, 2026" },
            { author: "Grace", text: "This community is going to be amazing! ❤️", date: "Oct 9, 2026" }
        ],
        reposts: 7
    },
    {
        id: 1002,
        author: "Sarah Johnson",
        title: "5 Habits That Can Change Your Life ✨",
        content: "Start your day with purpose. Read a few pages of a book, learn something new, take care of your health, set small goals, and make time for people who matter. Consistency beats perfection. Which habit are you working on?",
        date: "Oct 8, 2026",
        likes: 42,
        liked: false,
        reactions: {
            "👍": 21,
            "❤️": 32,
            "😂": 3,
            "😮": 8,
            "😢": 0
        },
        comments: [
            { author: "David", text: "Consistency is really the key!", date: "Oct 8, 2026" },
            { author: "Joy", text: "I'm working on reading every day.", date: "Oct 8, 2026" }
        ],
        reposts: 15
    },
    {
        id: 1003,
        author: "Michael James",
        title: "Learning to Code: My Journey 💻",
        content: "When I wrote my first lines of HTML, I never imagined how much I would enjoy building things for the web. If you are learning to code, don't give up when you get errors. Every bug you fix teaches you something new!",
        date: "Oct 7, 2026",
        likes: 31,
        liked: false,
        reactions: {
            "👍": 25,
            "❤️": 16,
            "😂": 6,
            "😮": 4,
            "😢": 1
        },
        comments: [
            { author: "Daniel", text: "Great advice for beginners!", date: "Oct 7, 2026" },
            { author: "Peter", text: "Debugging is part of the journey.", date: "Oct 7, 2026" },
            { author: "Sarah", text: "Never stop learning. 🚀", date: "Oct 7, 2026" }
        ],
        reposts: 9
    },
    {
        id: 1004,
        author: "Grace Williams",
        title: "A Little Reminder to Keep Going 🌻",
        content: "You don't have to have everything figured out today. Take one step, learn one lesson, and celebrate one small win. Progress may be slow, but every step forward matters.",
        date: "Oct 6, 2026",
        likes: 56,
        liked: false,
        reactions: {
            "👍": 19,
            "❤️": 45,
            "😂": 2,
            "😮": 3,
            "😢": 7
        },
        comments: [
            { author: "Joy", text: "I needed this reminder today. ❤️", date: "Oct 6, 2026" },
            { author: "Michael", text: "One step at a time!", date: "Oct 6, 2026" }
        ],
        reposts: 23
    }
];

// Load existing saved posts, or show demo posts on first visit.
let posts = JSON.parse(localStorage.getItem("blogPosts")) || defaultPosts;

// Ensure old saved posts have the fields required by this version.
posts.forEach(post => {
    post.reactions ||= {
        "👍": 0, "❤️": 0, "😂": 0, "😮": 0, "😢": 0
    };
    post.comments ||= [];
    post.likes ??= 0;
    post.reposts ??= 0;
    post.liked ??= false;
});

savePosts();


function savePosts() {

    localStorage.setItem(
        "blogPosts",
        JSON.stringify(posts)
    );

}


function displayPosts() {

    const container =
        document.getElementById("postsContainer");

    container.innerHTML = "";

    posts.forEach(post => {

        const postElement =
            document.createElement("article");

        postElement.className = "post";


        postElement.innerHTML = `

            <div class="post-header">

                <div>

                    <div class="author">
                        ${escapeHTML(post.author)}
                    </div>

                    <div class="date">
                        ${post.date}
                    </div>

                </div>

            </div>


            <h2>
                ${escapeHTML(post.title)}
            </h2>


            <p class="post-content">
                ${escapeHTML(post.content)}
            </p>


            <div class="actions">

                <button
                    class="like ${post.liked ? "active" : ""}"
                    onclick="likePost(${post.id})"
                >
                    ❤️ ${post.likes}
                </button>


                <button
                    onclick="toggleReactions(${post.id})"
                >
                    😊 React
                </button>


                <button
                    onclick="toggleComments(${post.id})"
                >
                    💬 ${post.comments.length}
                </button>


                <button
                    onclick="repostPost(${post.id})"
                >
                    🔁 ${post.reposts}
                </button>

            </div>


            <div
                class="reactions"
                id="reactions-${post.id}"
            >

                <button onclick="react(${post.id}, '👍')">
                    👍 ${post.reactions["👍"]}
                </button>

                <button onclick="react(${post.id}, '❤️')">
                    ❤️ ${post.reactions["❤️"]}
                </button>

                <button onclick="react(${post.id}, '😂')">
                    😂 ${post.reactions["😂"]}
                </button>

                <button onclick="react(${post.id}, '😮')">
                    😮 ${post.reactions["😮"]}
                </button>

                <button onclick="react(${post.id}, '😢')">
                    😢 ${post.reactions["😢"]}
                </button>

            </div>


            <div
                class="comments"
                id="comments-${post.id}"
                style="display:none"
            >

                <div>

                    ${displayComments(post)}

                </div>


                <div class="comment-form">

                    <input
                        type="text"
                        id="comment-${post.id}"
                        placeholder="Write a comment..."
                    >

                    <button
                        onclick="addComment(${post.id})"
                    >
                        Comment
                    </button>

                </div>

            </div>

        `;


        container.appendChild(postElement);

    });

}

function likePost(id) {

    const post = posts.find(
        post => post.id === id
    );


    if (!post) return;


    if (post.liked) {

        post.likes--;

        post.liked = false;

    } else {

        post.likes++;

        post.liked = true;

    }


    savePosts();

    displayPosts();

}

function toggleReactions(id) {

    const reactions =
        document.getElementById(
            `reactions-${id}`
        );


    if (
        reactions.style.display === "flex"
    ) {

        reactions.style.display = "none";

    } else {

        reactions.style.display = "flex";

    }

}

function react(id, reaction) {

    const post = posts.find(
        post => post.id === id
    );


    if (!post) return;


    post.reactions[reaction]++;


    savePosts();

    displayPosts();

}

function toggleComments(id) {

    const comments =
        document.getElementById(
            `comments-${id}`
        );


    if (comments.style.display === "block") {

        comments.style.display = "none";

    } else {

        comments.style.display = "block";

    }

}


function addComment(id) {

    const input =
        document.getElementById(
            `comment-${id}`
        );


    const text =
        input.value.trim();


    if (!text) {

        alert("Please write a comment.");

        return;

    }


    const post = posts.find(
        post => post.id === id
    );


    post.comments.push({

        author: "Guest",

        text: text,

        date: new Date().toLocaleDateString()

    });


    savePosts();

    displayPosts();


    setTimeout(() => {

        toggleComments(id);

    }, 50);

}


function displayComments(post) {

    if (post.comments.length === 0) {

        return `
            <p style="color:#777">
                No comments yet.
            </p>
        `;

    }


    return post.comments.map(comment => `

        <div class="comment">

            <strong>
                ${escapeHTML(comment.author)}
            </strong>

            <span>
                ${escapeHTML(comment.text)}
            </span>

        </div>

    `).join("");

}


function repostPost(id) {

    const original =
        posts.find(
            post => post.id === id
        );


    if (!original) return;


    const repost = {

        id: Date.now(),

        author: "Guest",

        title: "Reposted: " + original.title,

        content: original.content,

        date: new Date().toLocaleDateString(),

        likes: 0,

        liked: false,

        reactions: {

            "👍": 0,

            "❤️": 0,

            "😂": 0,

            "😮": 0,

            "😢": 0

        },

        comments: [],

        reposts: 0,

        isRepost: true

    };


    original.reposts++;


    posts.unshift(repost);


    savePosts();

    displayPosts();


    alert("Post reposted successfully!");

}


function createPost() {

    const title =
        document.getElementById(
            "postTitle"
        ).value.trim();


    const content =
        document.getElementById(
            "postContent"
        ).value.trim();


    const author =
        document.getElementById(
            "postAuthor"
        ).value.trim();


    if (!title || !content || !author) {

        alert(
            "Please fill in all fields."
        );

        return;

    }


    const newPost = {

        id: Date.now(),

        author: author,

        title: title,

        content: content,

        date: new Date().toLocaleDateString(),

        likes: 0,

        liked: false,

        reactions: {

            "👍": 0,

            "❤️": 0,

            "😂": 0,

            "😮": 0,

            "😢": 0

        },

        comments: [],

        reposts: 0

    };


    posts.unshift(newPost);


    savePosts();

    displayPosts();


    document.getElementById(
        "postTitle"
    ).value = "";


    document.getElementById(
        "postContent"
    ).value = "";


    document.getElementById(
        "postAuthor"
    ).value = "";


    closePostForm();

}


function openPostForm() {

    document.getElementById(
        "postForm"
    ).style.display = "block";

}


function closePostForm() {

    document.getElementById(
        "postForm"
    ).style.display = "none";

}



function escapeHTML(text) {

    const div =
        document.createElement("div");

    div.textContent = text;

    return div.innerHTML;

}

displayPosts();


function showPage(pageName) {
    const pages = {
        home: document.getElementById("homePage"),
        trending: document.getElementById("trendingPage"),
        about: document.getElementById("aboutPage")
    };

    if (!pages[pageName]) return;


    Object.entries(pages).forEach(([name, element]) => {
        element.hidden = name !== pageName;
    });


    document.querySelectorAll(".navbar nav a").forEach(link => {
        const target = link.getAttribute("href").slice(1);
        link.classList.toggle("active", target === pageName);
    });


    if (pageName === "trending") {
        displayTrendingPosts();
    }


    if (window.location.hash !== `#${pageName}`) {
        window.location.hash = pageName;
    }

    window.scrollTo({ top: 0, behavior: "smooth" });
}


function displayTrendingPosts() {
    const container = document.getElementById("trendingContainer");

    const popularPosts = [...posts].sort((a, b) => {
        const scoreA = a.likes +
            Object.values(a.reactions).reduce((sum, n) => sum + n, 0);

        const scoreB = b.likes +
            Object.values(b.reactions).reduce((sum, n) => sum + n, 0);

        return scoreB - scoreA;
    });

    container.innerHTML = "";

    if (popularPosts.length === 0) {
        container.innerHTML = `
            <p class="empty-message">
                No trending posts yet. Create the first post!
            </p>
        `;
        return;
    }


    popularPosts.forEach(post => {
        const originalContainer = document.getElementById("postsContainer");
        const originalCard = [...originalContainer.children].find(card => {
            return card.querySelector(".like")?.getAttribute("onclick")
                === `likePost(${post.id})`;
        });

        if (originalCard) {
            container.appendChild(originalCard.cloneNode(true));
        }
    });
}

function handlePageNavigation() {
    const pageName = window.location.hash.slice(1);
    const validPages = ["home", "trending", "about"];

    showPage(validPages.includes(pageName) ? pageName : "home");
}

window.addEventListener("hashchange", handlePageNavigation);


handlePageNavigation();

function applyTheme(theme) {
    const isDark = theme === "dark";

    document.body.classList.toggle("dark-mode", isDark);

    const button = document.getElementById("themeToggle");

    if (button) {
        button.textContent = isDark ? "☀️ Light" : "🌙 Dark";

        button.setAttribute(
            "aria-label",
            isDark ? "Switch to light mode" : "Switch to dark mode"
        );

        button.setAttribute("aria-pressed", String(isDark));
    }

    document.documentElement.style.colorScheme =
        isDark ? "dark" : "light";
}

function toggleTheme() {
    const isDark = document.body.classList.contains("dark-mode");

    const newTheme = isDark ? "light" : "dark";

    localStorage.setItem("blogTheme", newTheme);

    applyTheme(newTheme);
}

applyTheme(localStorage.getItem("blogTheme") || "light");

