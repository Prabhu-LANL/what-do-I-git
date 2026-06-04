.. target-start

.. _pandoc: https://pandoc.org/index.html
.. _conda-forge: https://conda-forge.org/
.. _Documentation: https://github.com/Prabhu-LANL/what-do-I-git
.. _`git novice`: https://swcarpentry.github.io/git-novice/
.. _`Software Carpentry`: https://software-carpentry.org/
.. _`Learn Git Branching`: https://learngitbranching.js.org/
.. _`Oh My Git`: https://ohmygit.org/
.. _`main slides`: https://prabhu-lanl.github.io/what-do-I-git/slides.html
.. _`quiz`: https://prabhu-lanl.github.io/what-do-I-git/quiz.html
.. _`practicum`: https://prabhu-lanl.github.io/what-do-I-git/practicum.html

.. _`Prabhu Khalsa`: prabhu@lanl.gov

.. target-end


###############
Git Talk Slides
###############


*******************
Project Description
*******************

.. project-description-start

A presentation for introducing scientists and engineers to git. This talk is designed to be given with a short quiz and a short practicum and meant to be done all in under an hour.

There are images, a slide template, and a markdown file for turning the main content into a powerpoint slide deck. The practicum and quiz can also be rendered as a powerpoint slide deck. Additionally there are html renderings of the content so that the talk can be given from a browser if desired.

An abstract is provided to be used when scheduling or otherwise describing the talk.

.. project-description-end

********
Abstract
********

.. abstract-start

What do I git out of it? This introductory talk provides scientists and engineers with a practical overview of Git and modern version control concepts, focusing on how Git supports reproducibility, collaboration, traceability, and safe experimentation in technical and research environments. Rather than treating Git as a tool only for software developers, the presentation demonstrates how version control can improve workflows for simulations, data analysis, documentation, manuscripts, configuration files, and long-running engineering or scientific projects. Attendees will learn the core ideas behind repositories, commits, staging, branching, merging, and synchronization, along with the most important commands needed to begin using Git effectively. The talk also introduces common collaboration workflows, discusses limitations such as handling binary files, and highlights best practices for organizing changes into meaningful, reproducible project history.

.. abstract-end

Information
===========

.. project-information-start

There are three markdown files, each of which can be converted to a powerpoint slide deck. One file has the main talk. Another is a short quiz and another is the practicum.

* `Documentation`_: This readme file

To learn git more thoroughly, please visit `Software Carpentry`_'s `git novice`_ lesson. 

For a visual learning tool see `Learn Git Branching`_.

If you'd like to learn by playing a game, visit `Oh My Git`_.


.. project-information-end

Author Info
===========

* `Prabhu Khalsa`_


***********
Quick Start
***********

.. quick-start-start

To convert the content into a slide deck, you must first have a powerpoint template and an installation of `pandoc`_ available. This repository includes a sample template.

`pandoc`_ is available via `conda-forge`_

   .. code-block::

      $ conda create --name pandoc-env python=3.14 # Create a new environment (optional)
      $ conda activate pandoc-env # Activate your environment
      $ conda install -c conda-forge pandoc

The conversion command is as follows

   .. code-block::

      $ pandoc git_out_of_it.md -t pptx --reference-doc=template.pptx -o git_out_of_it.pptx -f markdown+hard_line_breaks

For the other markdown files, the commands are essentially the same

   .. code-block::

      $ pandoc quiz.md -t pptx --reference-doc=template.pptx -o quiz.pptx -f markdown+hard_line_breaks
      $ pandoc practicum.md -t pptx --reference-doc=template.pptx -o practicum.pptx -f markdown+hard_line_breaks


.. quick-start-end

*****************************
HTML Rendering of slide decks
*****************************

.. html-render-start

* `main slides`_
* `quiz`_
* `practicum`_

.. html-render-end
