import '../App.css';

function Embed({ url }) {
    if (!url) {
        return <div/>
    }

    return (

        <iframe className="embed"
            src={url}
            allow="fullscreen;"
            allowfullscreen
        />
    )
}

export default Embed;
