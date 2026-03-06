.. target-start-do-not-remove

.. _pandoc: https://pandoc.org/index.html
.. _conda-forge: https://conda-forge.org/
.. _Documentation: https://github.com/Prabhu-LANL/what-do-I-git
.. _`git novice`: https://swcarpentry.github.io/git-novice/
.. _`Software Carpentry`: https://software-carpentry.org/

.. _`Prabhu Khalsa`: prabhu@lanl.gov

.. target-end-do-not-remove

###############
Git Talk Slides
###############


*******************
Project Description
*******************

A presentation for introducing scientists and engineers to git. This talk is designed to be given with a short practicum and meant to be done all in under an hour.

There are images and a markdown file for turning some content into a powerpoint slide deck.


Information
===========

There are two markdown files, each of which can be converted to a powerpoint slide deck. One file has the main talk. Another is a short quiz.

* `Documentation`_: This readme file

To learn git more thoroughly, please visit `Software Carpentry`_'s `git novice`_ lesson.

Author Info
===========

* `Prabhu Khalsa`_



***********
Quick Start
***********

To convert the content into a slide deck, you must first have a powerpoint template and an installation of `pandoc`_ available. This repository includes a sample template.

`pandoc`_ is available via `conda-forge`_

   .. code-block::

      $ conda create --name pandoc-env python=3.14 # Create a new environment (optional)
      $ conda activate pandoc-env # Activate your environment
      $ conda install -c conda-forge pandoc

The conversion command is as follows

   .. code-block::

      $ pandoc git_out_of_it.md -t pptx --reference-doc=template.pptx -o git_out_of_it.pptx -f markdown+hard_line_breaks
      $ pandoc quiz.md -t pptx --reference-doc=template.pptx -o quiz.pptx -f markdown+hard_line_breaks

