class Bubbles {
    constructor(options) {
        this.options = {
            element: document.getElementById('world'),
            airFriction: 0.03, // air friction of bodies 
        };

        this.resizeDelay = 400;

        // throttling variables and timeouts
        this.resizeTimeout = null;

        // Matter.js objects
        this.engine = null;
        this.render = null;
        this.runner = null;

        this.setSize();
        this.initScene();
        this.initEvents();
    }

    setSize() {
        this.viewportWidth = document.documentElement.clientWidth;
        this.viewportHeight = document.documentElement.clientHeight;
        /* this.viewportWidth = this.options.element.offsetWidth;
        this.viewportHeight = this.options.element.offsetHeight; */
    }

    initScene() {
        // engine
        this.engine = Matter.Engine.create(); // handles the physics
        this.engine.world.gravity.y = 3.3;

        // world
        this.world = this.engine.world; // stores the bodies

        // render
        this.render = Matter.Render.create({
            canvas: this.options.element,
            engine: this.engine,
            options: {
                width: this.options.element.offsetWidth,
                height: 800,
                background: 'transparent',
                wireframes: false,
                showAngleIndicator: false,
            },
        });
        Matter.Render.run(this.render);

        // runner 
        this.runner = Matter.Runner.create();
        Matter.Runner.run(this.runner, this.engine);

        this.initSvg();
        this.initWall();
    }

    random(range) {
        const [min, max] = range;
        return Math.random() * (max - min) + min;
    }

    rectangle(x, y, width, height) {
        return Matter.Bodies.rectangle(x, y, width, height, {
            isStatic: true,
            render: {
                visible: true,
            },
        });
    }

    initSvg() {
        const el = document.getElementById('svg');
        const paths = el.querySelectorAll('path');

        for (let i = 0; i < paths.length; i++) {
            const path = paths[i];
            const vertexSets = [];

            const points = Matter.Svg.pathToVertices(path, 3);
            vertexSets.push(Matter.Vertices.scale(points, 1.2, 1.2));

            Matter.World.add(this.engine.world, Matter.Bodies.fromVertices(800 + i * 150, 200 + i * 50, vertexSets, {
                render: {
                    fillStyle: '#000000',
                    strokeStyle: '#000000',
                    lineWidth: 1,
                    airFriction: this.options.airFriction,
                },
            }, true));
        }
    }

    initWall() {
        Matter.World.add(this.engine.world, [
            this.rectangle(this.options.element.offsetWidth / 2, 10, this.options.element.offsetWidth, 10), // top
            this.rectangle(this.options.element.offsetWidth / 2, 790, this.options.element.offsetWidth, 10), // bottom
            this.rectangle(10, 400, 10, 800), // left
            this.rectangle(this.options.element.offsetWidth - 10, 400, 10, 800), // right
        ]);
    }

    initEvents() {
        this.addEventListeners();
        this.dragNDrop();
    }

    dragNDrop() {
        this.mouseConstraint = Matter.MouseConstraint.create(this.engine, {
            element: this.options.element,
            constraint: {
                render: {
                    visible: false,
                },
                stiffness: 0.6,
            },
        });
        Matter.World.add(this.world, this.mouseConstraint);

        this.mouseConstraint.mouse.element.removeEventListener('mousewheel', this.mouseConstraint.mouse.mousewheel);
        this.mouseConstraint.mouse.element.removeEventListener('DOMMouseScroll', this.mouseConstraint.mouse.mousewheel);
    }

    shutdown() {
        Matter.Engine.clear(this.engine);
        Matter.Render.stop(this.render);
        Matter.Runner.stop(this.runner);
        this.removeEventListeners();
    }

    addEventListeners() {
        window.addEventListener('resize', this.onResizeThrottled.bind(this));
    }

    removeEventListeners() {
        window.removeEventListener('resize', this.onResizeThrottled);
    }

    onResizeThrottled() {
        if (!this.resizeTimeout) {
            this.resizeTimeout = setTimeout(this.onResize.bind(this), this.resizeDelay);
        }
    }

    onResize() {
        this.shutdown();
        this.initScene();
    }
}

window.addEventListener('DOMContentLoaded', () => {
    new Bubbles();
});