const workLink = document.getElementById("workLinkContainer");
const eWork = document.getElementById("exploreWork");

const move = e => {
    eWork.style.left = e.offsetX + 'px';
    eWork.style.top = e.offsetY + 'px';
};

//workLink.addEventListener("mouseenter", document.addEventListener("mousemove", move));

workLink.onmouseover = workLink.onmouseout = workLink.onmousemove = handler;

function handler(event) {
    let type = event.type;

    if(type == 'mousemove'){
        eWork.style.left = event.offsetX + 'px';
        eWork.style.top = event.offsetY + 'px';
    }
    if (type == 'mouseout') {
        eWork.style.left = "calc(50% - 70px)";
        eWork.style.top = "calc(50% - 70px)";
    }
    console.log(type + " target=" + event.target.id)

    return false;
}

