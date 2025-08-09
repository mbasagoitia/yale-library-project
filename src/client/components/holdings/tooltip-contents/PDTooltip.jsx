const PDTooltip = () => {

    const currentYear = new Date().getFullYear();

    return (
    <div className='pd-tooltip'>
        <p>As of {currentYear}, works published before January 1, {currentYear - 99} are generally in the public domain in the United States.</p>
        <p>For works published after that, the copyright term is 70 years after the author's death.</p>
    </div>
    )
}

export default PDTooltip;