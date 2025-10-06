---
title: "Contributing to Coolify Documentation"
---

# Coolify Docs Contribution Guide

This guide outlines the process for contributing updates and fixes to our docs. Please follow the steps below to ensure a smooth and efficient workflow.


## 1. Repository Workflow
- **Release Process:**  
  We follow a weekly production release cycle. The **main** branch represents production, while the **next** branch is used as our development branch.

- **Branching Guidelines:**  
  - **Do not create pull requests (PRs) to the main branch.**  
  - All contributions should be made to the **next** branch.
  - **Clone the repository from the next branch** to your GitHub account, then start working on your changes.


## 2. Getting Started

### Step 1: Fork and Clone the Repository
- First fork the docs repository to your github account, then clone your fork to your local system using:
  ```sh
  git clone https://github.com/your-username/your-repo-name.git
  ```
- Navigate to the cloned repository:
  ```sh
  cd your-repo-name
  ```

### Step 2: Install Dependencies and Run the Dev Server
We use [bun](https://bun.sh/) as our preferred package manager for local development. If you choose to use a different package manager, please **do not include its configuration files** in your commit.

To set up your environment, run:
```bash
bun install && bun run dev
```

The development server will start on `localhost` at port `5173`. You can view the documentation by navigating to:
```bash
http://localhost:5173/docs/
```


## 3. Image Guidelines
- **Format:**  
  All images used in the documentation must be in `.webp` format.
  
- **Location:**  
  Place all image files in the `/docs/public` directory.

- **Usage:**  
  Use the Zoomable image component on the docs to attach your images
  ```vue
  <ZoomableImage src="path-to-the-image.webp" alt="Path To The Image" />
  ```


## 4. Writing and Structuring Content

### Best Practices for Documentation:
- **Clear and Simple Language:**  
  Use plain and easily understandable English. Remember that not all readers are native English speakers.
  
- **Beginner-Friendly Guides:**  
  Break down instructions into small, easy-to-follow steps. Include screenshots wherever possible to help visualize the process, especially for users new to self-hosting or Coolify.

- **Content Organization:**  
  Structure your content with clear headings, bullet points, and numbered steps where applicable. This makes it easier for readers to follow along.


## 5. Submitting Your Contribution
1. **Commit your changes to your repository**  

2. **Create a Pull Request:**  
   - Open a pull request (PR) to merge your changes into the **next** branch on the docs repository. 
   - Provide a detailed description of your updates to help maintainers review your contribution effectively.


## 6. Questions and Support
If you have any questions or run into issues while contributing:
  - **Create an Issue:** Open an issue on the repository detailing your issue.
  - **Discord:** Reach out to us on contribute channel on the [Coolify Discord community](https://coolify.io/discord).


## 7. Important Notes
- **Documentation Updates:**  
  The current docs are bit outdated and missing some information. The docs maintainers are actively rewriting parts of the documentation to improve structure and clarity before new content is added.

- **PR Approval:**  
  Merging of your PR is subject to review by the maintainers. Please be patient as they work through the process.


We appreciate your contribution and effort in making the Coolify docs better for everyone.