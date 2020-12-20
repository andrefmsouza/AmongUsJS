const Cafeteria = {
    obstacles: [
        //Paredes
        {
            type: 'line',
            x1: 1800,
            y1: 500,
            x2: 1800,
            y2: 290
        },
        {
            type: 'line',
            x1: 1800,
            y1: 290,
            x2: 1963,
            y2: 128
        },
        {
            type: 'line',
            x1: 1963,
            y1: 128,
            x2: 2488,
            y2: 128
        },
        {
            type: 'line',
            x1: 2488,
            y1: 128,
            x2: 2727,
            y2: 360
        },
        {
            type: 'line',
            x1: 2727,
            y1: 360,
            x2: 2727,
            y2: 500
        },
        {
            type: 'line',
            x1: 2728,
            y1: 615,
            x2: 2728,
            y2: 810
        },
        {
            type: 'line',
            x1: 2728,
            y1: 810,
            x2: 2516,
            y2: 1022
        },
        {
            type: 'line',
            x1: 2516,
            y1: 1022,
            x2: 2311,
            y2: 1022
        },
        {
            type: 'line',
            x1: 2205,
            y1: 1022,
            x2: 2006,
            y2: 1022
        },
        {
            type: 'line',
            x1: 2006,
            y1: 1022,
            x2: 1800,
            y2: 815
        },
        {
            type: 'line',
            x1: 1800,
            y1: 815,
            x2: 1800,
            y2: 616
        },

        //Corredor da esquerda
        {
            type: 'line',
            x1: 1800,
            y1: 500,
            x2: 1700,
            y2: 500
        },
        {
            type: 'line',
            x1: 1800,
            y1: 616,
            x2: 1700,
            y2: 616
        },

        //Corredor da direita
        {
            type: 'line',
            x1: 2727,
            y1: 500,
            x2: 2815,
            y2: 500
        },
        {
            type: 'line',
            x1: 2727,
            y1: 615,
            x2: 2815,
            y2: 615
        },

        //Mesas
        {
            type: 'circle',
            x: 2000,
            y:795,
            radius: 84
        },
        {
            type: 'circle',
            x: 2075,
            y:795,
            radius: 84
        },
        {
            type: 'circle',
            x: 2415,
            y:795,
            radius: 84
        },
        {
            type: 'circle',
            x: 2485,
            y:795,
            radius: 84
        },

        {
            type: 'circle',
            x: 2210,
            y: 585,
            radius: 84
        },
        {
            type: 'circle',
            x: 2281,
            y: 585,
            radius: 84
        },
        {
            type: 'circle',
            x: 2000,
            y: 362,
            radius: 84
        },
        {
            type: 'circle',
            x: 2071,
            y: 362,
            radius: 84
        },

        {
            type: 'circle',
            x: 2415,
            y: 362,
            radius: 84
        },
        {
            type: 'circle',
            x: 2486,
            y: 362,
            radius: 84
        }
    ]
}

export default Cafeteria;