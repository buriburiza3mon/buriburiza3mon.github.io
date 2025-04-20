<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>buriburiza3mon</title>
  <style>
    body {
      margin: 0;
      padding: 0;
      background-color: #000;
      color: #41FF00;
      font-family: 'Courier New', monospace;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      height: 100vh;
    }

    h1 {
      margin-bottom: 40px;
      font-size: 2.5rem;
      text-shadow: 0 0 10px #41FF00;
    }

    .grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 20px;
      width: 80%;
      max-width: 700px;
    }

    .tile {
      background-color: #111;
      border: 2px solid #41FF00;
      border-radius: 10px;
      padding: 40px 20px;
      text-align: center;
      font-size: 1.2rem;
      text-decoration: none;
      color: #41FF00;
      transition: 0.3s ease-in-out;
      box-shadow: 0 0 10px transparent;
    }

    .tile:hover {
      background-color: #000;
      box-shadow: 0 0 20px #41FF00;
      transform: scale(1.05);
    }
  </style>
</head>
<body>
  <h1>Welcome to buriburiza3mon</h1>
  <div class="grid">
    <a class="tile" href="blog.html">✍️ Blog</a>
    <a class="tile" href="writeups.html">🕵️‍♂️ Writeups</a>
    <a class="tile" href="about.html">🧠 About Me</a>
  </div>
</body>
</html>
