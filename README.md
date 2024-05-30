# Yale Ensembles Library Project

This is a project aimed at organizing the Yale Ensembles Library's (starting with the Yale Philharmonia) holdings collection using the Dickinson Classification system, a system used by the performance libraries of institutions such as Vassar College and Columbia University, and building a counting and searching mechanism that allows materials to easily be tracked and found within the library. The Dickinson Classification system is a flexible, scalable, and organized system that uses ten major divisions for musical materials, further organized by composer (each of which is assigned a unique cutter number), work, and publisher/edition.


## Classification Scheme Overview

Described by Carol June Bradley in The Dickinson Classification for Music (read more here: https://www.jstor.org/stable/23505207), the classification scheme is as follows:

The first line is the division number; this expresses the original medium of the work.
The second line consists of the composer's Cutter number.
The third line describes the piece in hand: a species title indication, such as ov for overture; the first letter of the title, if distinctive; an opus or thematic catalogue number.
The fourth line is the first letter of the editor's or publisher's name, whichever is more appropriate to accurate description of the volumne in hand.

For example:

61 Orchestra, full
B73 Brahms
ov species title indication: edition of Brahms' concert overtures
C Cranz edition

A more comprehensive overview of the ten genres covered by the Dickinson Classification system can be found here: https://library.vassar.edu/musiclibrary/home/musical-score-call-numbers

## Part One: Accession/Call Number Assigning System

An initial inventory of the performance library will be taken, and each set of music parts and its corresponding score, if present, will be assigned two values:

- A unique accession number, which serves as a chronological record of acquisitions. New pieces that we purchase throughout the year will be added to the end of the existing list, which is created through an initial inventory.
- A (not necessarily unique) call number*, which is determined based on the guidelines outlined by the Dickinson Classification system.

Pieces will be logically organized in the physical library by call number.

When adding a new piece to the library, both the accession number and the call number will be dynamically assigned based upon a series of user inputs (genre, composer, species title, edition/publisher). Composer cutter numbers will be assigned based on Yale University's composer cutter number list, accessible here: https://web.library.yale.edu/cataloging/music/cuttera

Automatically assigning a meaningful call number through a user-friendly interface avoids the complicated process of manually assigning each number, and it quickly informs the librarian of the appropriate section that the new piece should be placed. While a small library may see minimal benefit from this system, there is good potential of scalability as the library grows.

*The call number may not necessarily be unique because we may own several pieces of the same genre by the same composer, having the same edition/publisher (i.e. Brahms Symphony no. 1 and Brahms Symphony no. 2, both Barentreiter editions, or Mozart Cosi Fan Tutte and The Marriage of Figaro). In these cases, enough information is present to sufficiently organize the materials to a high degree, and the librarian can simply order by number, alphabetically, or in some other logical way beyond that, if desired.


## Part Two: Automatic Cataloguing System

In order to keep track of music that goes in and out of the library, special attention will be kept of the number of existing materials in each section, and will therefore be organized into logical subsections and automatically counted. For example, the database will keep track of the total number of Beethoven's works in our library, and further, the number of Beethoven symphonies that we own, the number of Beethoven overtures that we own, etc.

Example:

Orchestral Music (500)
    - Beethoven (11)
        - Overtures (2)
        - Symphonies (9)
    - Mozart (45)
        - Symphonies (35)
        - Operas (4)
        - Chamber Music (6)
            - String quartets (3)
            - Woodwind quintets (3)

When a new piece is added to a specific section, all relevant numbers will automatically update to reflect that. It is not necessary to keep track of this information in the physical library, as it doesn't contribute to the organizational scheme. However, since pieces with similar call numbers will be closely-grouped, it will be convenient for the librarian to periodically check that the number of expected materials in each subsection matches what is actually present, reducing the risk of lost or missing materials.

## Part Three: Searching System

When we need to pull parts and scores from our collection, each piece and its relevant information (call number, location, form (digital/physical), condition, in/out status, etc.) should be easily and quickly accessible by a few keywords. I intend to implement a system that allows librarians to search our entire collection within seconds, finding the necessary materials easily. A series of filters and keyword searches will be available to the user.

## Physical Parts vs Digital Scans

Currently, the Philharmonia holdings exist in two locations: as digital scans saved on the computer, and as physical parts on the shelves. Some exist in both forms, and others in only one. A thorough inventory will also be conducted of the digital holdings (scans), and the database will store information about what form the materials are available in (digital, physical, or both). The digital holdings will be organized in a logical manner on the computer, similar to the physical shelves. The existing file names may be changed for the purposes of clarity and searchability.