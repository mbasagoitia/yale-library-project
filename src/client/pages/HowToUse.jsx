const HowToUse = () => {

    // Don't store in navbar, add a help icon that loads this page. Show once at setup wizard, add as a pdf document.
    // Add section on backing up the catalogue
    return (
        <div className="home">
            <h1>How To Use This Application</h1>
            <div className="mt-4">
                <h2>Welcome to the Yale Philharmonia Library Catalogue!</h2>
                <p>This application is designed to be an all-in-one storage and cataloguing tool for the Yale Philharmonia's performance library.</p>
                
                <h3>Classification Guide</h3>
                <p>The library materials are catalogued and organized based on the George Sherman Dickinson Classification Guide for Musical Compositions. Please familiarize yourself with the guide on this page. When adding a new piece to the library, be sure to generate the call number (on the manage holdings page), create a label with the call number, and affix it to the folder before shelving.</p>

                <h3>Physical Library Holdings</h3>
                <p>From the Browse Holdings page, you can easily browse the collection or search for a specific work, retrieve information about any piece owned by the Philharmonia, look up its call number, and easily find materials in the library shelves. Librarians with administrative permission can modify the catalogue (add, edit, and delete pieces) to accurately reflect the physical library holdings.</p>

                <h3>Digital Catalogue</h3>
                <p>The Digital Catalogue is a repository for all digital music scans, sorted by composer. The digital catalogue only supports PDF filetypes. From here, you can browse, upload, open, and preview PDF files. Preview is especially helpful to see any relevant bowings or markings. To use the digital catalogue, you must specify the base path on your computer where the directory containing the scans are located. You can either save files directly into the Digital Catalogue folder (from email, IMSLP, etc.), or if you have downloaded them somewhere else, use the Upload button to move them into the folder and add them to the catalogue. When adding a new physical piece to the database, you have the option to link its digital scans (if they exist) in the Digital Catalogue.</p>

                <h3>Reports</h3>
                <p>To effectively monitor and maintain the library holdings over time, you may want to periodically generate reports. Various metrics (pieces with poor condition, missing parts, music by composer, etc.) give a snapshot overview of the state of the library and can be used to justify new music purchases or replacements.</p>

                <h3>Librarian Admin Permissions</h3>
                <p>Anyone can browse the catalogue, but only Yale NetID verified librarians (or default admins, see below) can modify it. If you need admin access but do not have it, see "get admin access" in the FAQ below.</p>
            </div>
            <div className="mt-4">
                <h2>Frequently Asked Questions</h2>
                <p><strong>How do I get librarian admin access?</strong></p>
                <p>Admin permission may only be granted by other admins or the system administrator. The people who have default admin access to this app include:</p> 
                <ul>
                    <li>Production Coordinator and Librarian (main user)</li>
                    <li>Philharmonia General Manager</li>
                    <li>Desktop Support Specialist</li>
                    <li>Director of Technology</li>
                    <li>School of Music Deputy Dean</li>
                    <li>Director of Operations</li>
                </ul>
                <p>If you are new to this position and do not yet have admin access, you may contact one of the above individuals and ask them to log in and grant you administrative access through the "Settings" page.</p>
                <p>In the event that this is not possible, please fill out this form so that the system administrator can grant admin access.</p>
                <p>Once you have admin access, you may choose to add other admins. For security purposes and to protect the integrity of the library catalogue, only add trusted librarians, such as student library workers, as administrators. A name and a correct NetID are required to grant admin privileges.</p>
                
                <p><strong>Why can't I see anything in the digital catalogue?</strong></p>
                <p>If you cannot see anything in the digital catalogue, it is likely due to a folder path misconfiguration or a missing folder. You will get an error when the application launches prompting you to choose the folder if it is missing or the application can't find it. Close the app and look for this warning, then follow the steps on the screen. If the issue persists, follow these steps in order:</p>
                <ol>
                    <li>Locate the folder with the digital scans (it likely exists somewhere on the computer (show pic)). It may be named something like "philharmonia_library_digital_catalogue", "philharmonia library", "music scans", "philharmonia catalogue", etc.</li>
                    <li>Delete the folder if it exists</li>
                    <li>Download it again from the Google Drive account associated with yalephilharmonia@gmail.com. It may also be located in the School of Music shared storage. Look for philharmonia_library_digital_catalogue.zip</li>
                    <li>Move the zip file to the Documents folder on your computer. Do not put it inside of any other folders.</li>
                    <li>Expand (unzip) the folder and make sure it is named <strong>philharmonia_library_digital_catalogue</strong> <em>exactly</em>. Do not capitalize, add spaces, etc. This folder contains other folders of composer names, each of which in turn contains folders of pieces, which eventually lead to PDF scans of music.</li>
                    <li>Navigate to the settings page on this app and go to "set digital catalogue base path." Choose "philharmonia_library_digital_catalogue" and click "set base path."</li>
                    <li>Navigate back to the digital catalogue page. You may need to close the app first. You should now see the folders of composer names on this page.</li>
                    <li>Periodically back up and compress (zip) the digital catalogue from the Settings page and store it in Google Drive or another safe storage.</li>
                </ol>

                <p><strong>What do I do with the call number? What does it mean?</strong></p>
                <p>The call number is an important identifying piece of information for each piece in the collection. It contains four categories in one: composer, ensemble type, genre, and publisher, and occasionally includes further identifying information, such as an opus number. The cataloguing system automatically assigns a call number to a piece and save it in the database, so you don't need to worry about generating it yourself. When cataloguing a new piece, make sure to write down the call number before pressing submit, create a new label with the call number on a single line separated by spaces, and affix it to the folder.</p>
                <p>As indicated by the call number, pieces will be organized by ensemble type, then further by composer, genre, and finally publisher. Please familiarize yourself with the shelving guide to correctly shelve the new materials.</p>
            </div>
        </div>
    );
};

export default HowToUse;