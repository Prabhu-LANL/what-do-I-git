.. target-start-do-not-remove

.. _pandoc: https://pandoc.org/index.html
.. _conda-forge: https://conda-forge.org/

.. _`Prabhu Khalsa`: prabhu@lanl.gov

.. target-end-do-not-remove

###############
Git Talk Slides
###############


*******************
Project Description
*******************

A repository with content required to give an introductory talk about git. There are images and a markdown 
file for turning the content into a powerpoint slide deck.


Information
===========

* Documentation: 

Author Info
===========

* `Prabhu Khalsa`_

***********
Quick Start
***********

.. user-start-do-not-remove

To convert the content into a slide deck, you must first have a powerpoint template and an installation of `pandoc`_ available.
`pandoc`_ is available via `conda-forge`_

   .. code-block::

      $ conda create --name pandoc-env python=3.14 # Create a new environment (optional)
      $ conda activate pandoc-env # Activate your environment
      $ conda install -c conda-forge pandoc

The conversion command is as follows

   .. code-block::

      $ pandoc git_out_of_it.md -t pptx --reference-doc=template.pptx -o git_out_of_it.pptx -f markdown+hard_line_breaks

