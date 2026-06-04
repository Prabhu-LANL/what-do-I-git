---                                                                             
title: "What do I Git out of it?"
subtitle: "Git started in under an hour \n An introduction to Git for Scientists and Engineers"
author: "Prabhu S. Khalsa"
date: today
---

<!-- slide 2 -->
# Why Git? {layout="Two Content"}
:::: columns
::: column

First let's imagine

- A laboratory notebook whose pages can come alive to
- Move forward and backward in time
- Precisely attribute its contents to their creators
- Tell you its own history
- Tell you a story of collaboration
- Invite you to contribute
- Invite you to experiment without negative consequences
- Duplicate itself just for you

&nbsp;

Now let's see

- Why Git is important
- Why we should use it
- How easily you can start
:::
::: column
![A scientific Integrity Tool](docs/images/laboratory_notebook_integrity.png)
:::
::::
::: notes
Git is not just a software development tool, it is a scientific integrity tool
:::

<!-- slide 3 -->
# Git is powerful (and so can you!) {layout="Two Content"}
:::: columns
::: column

Git = 

&nbsp;

Reproducibility +
Traceability&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;+
Safety&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;+
Collaboration&nbsp;&nbsp;&nbsp;+
Scalability&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;+
Recoverability&nbsp;&nbsp;+
Professionalism

&nbsp;

= Important concepts in Science and Engineering

&nbsp;

= Nice things we can all have
:::
::: column
![You - an hour from now](docs/images/wizards.png)
:::
::::

<!-- slide 4 -->
# Reproducibility and Traceability {layout="Two Content"}
:::: columns
::: column

Scientific and Engineering integrity require

&nbsp;

- &#128220; Complete history of every change
  - Traceability
      - See who changed what and why and when
  - Maintain long-term project memory
    - Past and current collaborators, files, struggles, reasoning, etc.

&nbsp;

- &#128300; Reproducible results
  - Recreate exact results from any past version
    - Identify which version of the code produced which figure, report, calculations, etc.
:::
::: column
![](docs/images/reproducibility.png)
:::
::::

<!-- slide 5 -->
# Safety and Collaboration {layout="Two Content"}
:::: columns
::: column
- &#129514; Safe experimentation through branching encourages innovation
  - Try new algorithms safely, explore alternate models, test parameter changes, etc.
  - Prototype without risk. If failure:
    - Switch back instantly with no damage to stable work
      - Remove fear of breaking things
- &#x1F91D; Collaborate without chaos – multiple people, but one clean history
  - Parallel collaboration without overwrites
  - Merge changes intelligently
  - Detect and resolve conflicts cleanly
  - Avoid email attachments, shared drives, file name versioning, manual merge errors
    - &#128683; Before Git - Analysis_final_v7_for_real_20260305.py
    - &#128077; With Git - Anaylsis.py - clear, time-stamped, documented revisions
:::
::: column
![](docs/images/safety.png)
:::
::::

<!-- slide 6 -->
# Professional Work {layout="Two Content"}
:::: columns
::: column
- &#128524; Debugging and recovery
  - Find problems faster
    - Small logical commits
    - Precise change tracking
    - Identify when a bug was introduced
  - Revert to known good states
  - Git makes debugging scientific
  - Never debug the same problem again!
- &#x1F4C8; Easy scalability
  - Solo grad student &rarr; Multi-institution collaboration
  - Single script &rarr; Full simulation framework
  - Short experiment &rarr; Decades long program
- &#9989; Git is industry standard
  - Essential to software engineering
  - Increasingly expected for broader scientific and engineering work

:::
::: column
![](docs/images/professional_work.png)
:::
::::

<!-- slide 7 -->
# Git beyond code: Applications in Science & Engineering {layout="Two Content"}
:::: columns
::: column

&nbsp;

- Data analysis workflows
  - Track changes in Python/R/Matlab notebooks

&nbsp;

- Documents (html/markdown/LaTeX/etc.) version control
  - Reports, grant proposals, lab manuals, manuscripts

&nbsp;

- CAD/Engineering design
  - Collaborate on configuration files or parametric scripts

&nbsp;

- Simulations
  - Keep track of model versions, parameters, inputs, and results
:::
::: column
![](docs/images/LaTeX.png)
:::
::::


<!-- slide 8 -->
# What NOT to put in Git {layout="Two Content"}
:::: columns
::: column
- Large binary files
  - Git's Strength is in line-based diffs
  - Git uses a line-by-line comparison system to track changes between file versions. This works great for:
    - Code (.py, .c, .cpp, etc.)
    - Configuration files (.yaml, .json, etc.)
    - Documentation in plain text formats (.html, .tex, .md, etc.)
  - Binary files, however, are stored as sequences of bytes that do not have clear line breaks. Git:
    - Cannot show meaningful differences when you run `git diff`
    - Treats each version of a binary file as entirely new, even for small changes

&nbsp;

- Use .gitignore to ignore common binary file extensions (e.g. *.so)
:::
::: column
![](docs/images/binary_data.png)
:::
::::
::: notes
Small binary files are fine, they will simply be replaced when they are changed
:::

<!-- slide 9 -->
# What does it cost me to Git these benefits? {layout="Two Content"}
:::: columns
::: column

&nbsp;

- Thinking
  - Remember the benefits - scientific integrity
  - Likely to start thinking of our beloved binary file formats in terms of "text-based inputs" and the actions needed to re-create them
  - Likely to eventually memorize the most commonly used commands

&nbsp;

- Habit forming - What you put in you'll Git out
  - Small, frequent commits!
  - Meaningful commit messages!

&nbsp;

- Expense
  - Git is free and open-source
  - Likely to cost you more if you don't use it
:::
::: column
![](docs/images/git_cost.png)
:::
::::

<!-- slide 10 -->
# So what is Git? {layout="Two Content"}
:::: columns
::: column
It's not just a software development tool, it is a ...
:::
::: column
![Scientific _______ tool](docs/images/question_mark.png)
:::
::::
::: notes
A scientific integrity tool
:::

<!-- slide 11 -->
# Key Git Concepts {layout="Two Content"}
:::: columns
::: column

- Repository (repo): a tracked project folder\
- Commit: a snapshot of changes\
- Branch: a parallel line of development

:::
::: column

![](docs/images/Physical_Repository.png){width=100%}
:::
::::

::: notes
The binder is a repository, the paper is a file, the box is the staging area
the notebook is the Git log with a new entry after the paper has been added
back into the binder
:::

<!-- slide 12 -->
# Essential Git Commands {layout="Title and Content"}
| Action          | Command                   | Description                         |
|:----------------|:--------------------------|:------------------------------------|
| Initialize repo | *git init*                | Start tracking current directory    |
| Clone a repo    | *git clone \<URL\>*       | Clone an existing repo              |
| Check status    | *git status*              | See current state of repo           |
| Add files       | *git add \<file\>*        | Stage changes for commit            |
| Commit changes  | *git commit -m "Message"* | Save a snapshot with a message      |
| View history    | *git log*                 | See previous commits                |
| Create a branch | *git branch \<name\>*     | Make a new branch                   |
| Switch branches | *git checkout \<name\>*   | Move to another branch              |
| Merge branches  | *git merge \<name\>*      | Merge other branch into current one |
| Push to remote  | *git push*                | Upload changes to GitHub/GitLab     |
| Pull updates    | *git pull*                | Download updates from remote repo   |


<!-- slide 13 -->
# Typical workflow in collaborative project {layout="Content with Caption"}

- Clone Repository - brings the repository into your working directory
- Create Branch - space to do your work before merging back into the main branch
- Add and Commit changes - staging and committing your work with meaningful messages about changes
- (optionally) rebase or merge - incorporate changes/updates of parent branch into your branch
- Push - push your local branch to one of your remotes to backup your branch
- Merge - When development has completed, after review, merge your branch into the main upstream development branch

![](docs/images/branching.png)

<!-- slide 14 -->
# Beyond the command line {layout="Two Content"}
:::: columns
::: column

- Online platforms like GitHub/GitLab allow
  - Cloud (or server) backups
  - Visualizing differences between versions
  - Managing issues and project tasks
  - Collaborating asynchronously
  - CI/CD - continuous integration/continuous deployment

:::
::: column
![](docs/images/github.png){width=100%}
:::
::::

<!-- slide 15 -->
# Tips for adopting Git in scientific work {layout="Two Content"}
:::: columns
::: column

- Start simple
  - Track a small project like a paper or data analysis script
- Use visual tools
  - GitHub Desktop, GitKraken, or VSCode Git UI
- Commit regularly
  - Small frequent commits tell a better story than rare massive ones
- Write meaningful commit messages
  - “Fixed bug in data cleaner” is more useful than “stuff”
  - If applied, this commit will...
- Backup to remote
  - Use GitHub or GitLab to avoid local data loss
- Check out software carpentry’s Git lessons
- Check out visual learning tools (oh my Git, learn Git branching, etc.)

:::
::: column
![](docs/images/easy_button.png)
:::
::::
::: notes
https://swcarpentry.github.io/git-novice/  
https://ohmygit.org/
https://learngitbranching.js.org/
:::

<!-- slide 16 -->
# Conclusion {layout="Two Content"}
:::: columns
::: column

- Git is a lightweight, powerful “Scientific Integrity” tool
  - Reproducibility + Safety + Collaboration
    - Complete history of every change
    - Collaboration without chaos
    - Allows for experimentation
    - Grows with your project
  - Professional work that's easy to scale and to recover

- Minimal effort for maximum reward
  - A slight adjustment to thinking and habits for all of the above
- Start simple, experiment, see tutorials and games for deeper understanding
- Whether you're writing code, papers, or setting up experimental workflows, Git will make your work more robust and future-proof

:::
::: column
![](docs/images/git_superhero.png)
:::
::::

