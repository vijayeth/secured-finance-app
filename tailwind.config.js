module.exports = {
    darkMode: 'media',
    purge: ['./src/**/*.{ts,tsx,js,jsx}'],
    theme: {
        extend: {
            colors: {
                background: '#060609',
                lightBackground: '#FFFFFF',
                black: '#000',
                darkGrey: '#1a1b1f',
                strokeGrey: '#27282f',
                turquoise: '#38afa8',
                green: '#0F9D58',
                red: '#F23A32',
                darkPurple: '#5b50de',
                purple: '#666cf3',
                bluePurple: '#4557fb',
                brightBlue: '#4faaff',
                blue: '#70a9d4',
                gray: '#494a52',
                lightGrey: '#7a7c89',
                middleGrey: '#9496a3',
                lightSilver: '#b9b9c2',
                white: '#fff',
                darkenedBg: '#122735',
                tableHeader: '#122735',
                tableBorder: '#1c303f',

                // colors for the design system\
                // generated with https://tailwind.simeongriggs.dev/
                primary: {
                    '50': '#ECEBFA',
                    '100': '#D9D7F4',
                    '200': '#B3AEEA',
                    '300': '#8E86DF',
                    '400': '#685ED4',
                    '500': '#4338CA',
                    '600': '#352BA1',
                    '700': '#282079',
                    '800': '#1A1551',
                    '900': '#0D0B28',
                },
            },
            fontSize: {
                subhead: '0.875rem',
            },
            width: {
                'button-xs': '8rem',
                'button-sm': '11rem',
                'button-md': '20rem',
                'button-lg': '40rem',
            },
            height: {
                'button-xs': '2.25rem',
                'button-sm': '2.25rem',
                'button-md': '4rem',
                'button-lg': '4rem',
            },
        },
    },
    plugins: [],
};
