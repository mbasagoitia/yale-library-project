const ClassificationGuide = () => {

    const handleOpenUrl = async (e, url) => {
        e.preventDefault();
        if (window?.api?.external?.openExternal) {
            await window.api.external.openExternal(url);
        }
    }

    return (
        <div className="classification-guide">
            <h1>The Dickinson Classification Scheme for Musical Compositions</h1>
            <section className="mt-4">
                <h2>Overview</h2>
                <p>The Dickinson Classification Scheme is a library classification system designed specifically for cataloging and organizing musical compositions. Developed by George Sherman Dickinson in 1938, it has been widely adopted by music libraries, including those at Vassar College and Columbia University.</p>
                <p>While each library will require slightly different arrangements and categorizations of its materials, the Dickinson Classification Scheme employs numeric classifications and mnemonic notation to determine a call number, allowing various levels of specificity depending on the library's requirements.  </p>
            </section>
            <section>
                <h2>Call Numbers</h2>
                <p>Let's consider a call number under the Dickinson Classification Scheme:</p>
                <pre>
                    61
                    B813
                    ovt
                    C
                </pre>
                <p><strong>Division Number:</strong><br></br> Indicates the medium (e.g., orchestral, vocal, etc.).</p><p><em>e. g. 61 (Orchestra - Full)</em></p>
                <p><strong>Composer's Cutter Number:</strong><br></br> Assigned to the composer according to a predetermined system. The Yale Philharmonia Library utilizes the composer cutter numbers defined by the cataloguing system at Yale's Irving S. Gilmore Music Library, found <span className="link-text" onClick={(e) => handleOpenUrl(e, "https://web.library.yale.edu/cataloging/music/cuttera")}>here</span>.</p><p><em>e. g. B813 (Brahms)</em></p>
                <p><strong>Species Title Indication:</strong><br></br> Indicates the genre of the composition, such as an overture. May also be an opus/number designation if distinctive, such as 18/1 (in the case of Beethoven's string quartets).</p><p><em> e.g. ovt (overture)</em></p>
                <p><strong>Publisher/Editor:</strong><br></br> Letter(s) indicating the name of the editor or publisher, whichever is more appropriate to the volume in hand.</p><p><em> e.g. C (Cranz edition)</em></p>
            </section>
            <section>
                <h2>Arrangements</h2>
                <p>The symbol "=" is used to show that a composition is in a state of arrangement. The numerical notation for the original medium of the composition precedes the symbol, and the notation for the medium for which it has been arranged follows. For example, "61" represents orchestral music, and "15" represents organ music; the notation "61 = 15" indicates orchestral compositions arranged for organ.</p>
            </section>
            <section>
                <h2>References</h2>
                <p>For further reading on the Dickinson Classification Scheme and its application, refer to:</p>
                <ul>
                    <li className="link-text" onClick={(e) => handleOpenUrl(e, "https://www.jstor.org/stable/23505207")}>Bradley, Carol June. <em>The Dickinson Classification for Music</em>.</li>
                </ul>
            </section>
        </div>
    )
}

export default ClassificationGuide;