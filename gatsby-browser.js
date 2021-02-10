exports.onRouteUpdate = ({location, prevLocation}) => {
    if(window.MathJax) {
	window.MathJax.typesetPromise()
	console.log("typesetting ...")
    }

}
