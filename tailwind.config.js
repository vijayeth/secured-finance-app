const defaultTheme = require('tailwindcss/defaultTheme');

module.exports = {
    content: ['./src/**/*.{ts,tsx,js,jsx}', './public/index.html'],
    safelist: [
        {
            pattern: /grid-cols-./,
        },
    ],
    theme: {
        extend: {
            gridTemplateColumns: {
                '1-actions': 'repeat(1, minmax(95px, 1fr))',
                '2-actions': 'repeat(2, minmax(95px, 1fr))',
                '3-actions': 'repeat(3, minmax(95px, 1fr))',
            },
            boxShadow: {
                deep: '0px 34px 64px 0px rgba(0, 0, 0, 0.45)',
                dropdown: '0px 16px 64px -48px rgba(31, 47, 70, 0.4)',
                tab: '0px 46px 64px 0px rgba(31, 47, 70, 0.4)',
                selector: 'inset 0px 2px 4px rgba(0, 0, 0, 0.25)',
                sliderthumb: '0px 4px 16px -8px rgba(15, 15, 15, 0.1)',
                curvetooltip: '0px 4px 4px rgba(0, 0, 0, 0.25)',
            },
            borderWidth: {
                '0.5': '0.5px',
            },
            backgroundImage: {
                wrap: 'linear-gradient(0deg, rgba(0, 0, 0, 0.40) 0%, rgba(0, 0, 0, 0.40) 100%), linear-gradient(114deg, #0090FF -9.78%, rgba(0, 144, 255, 0.00) 65.39%)',
            },
            dropShadow: {
                tab: '0px 46px 64px rgba(31, 47, 70, 0.4)',
            },
            margin: {
                '0.5': '0.125rem',
                '10px': '10px',
            },
            transitionProperty: {
                width: 'width',
            },
            height: {
                '1px': '1px',
                '2px': '2px',
                '5px': '5px',
                '6px': '6px',
                '14px': '14px',
                '18px': '18px',
                screen: [
                    '100vh /* fallback for Opera, IE and etc. */',
                    '100dvh',
                ],
            },
            width: {
                '1px': '1px',
                '2px': '2px',
                '6px': '6px',
                '14px': '14px',
                '18px': '18px',
                '70%-gap-3': 'calc(70% - (3/4 * 1rem))',
                '30%-gap-3': 'calc(30% - (3/4 * 1rem))',
            },
            gap: {
                '10px': '10px',
            },
        },

        fontFamily: {
            primary: ['GT Super Display', ...defaultTheme.fontFamily.serif],
            secondary: [
                'Suisse International',
                ...defaultTheme.fontFamily.sans,
            ],
        },

        screens: {
            tablet: '768px',
            laptop: '1024px',
            desktop: '1440px',
            horizontalTab: '1120px',
        },

        fontSize: {
            '5xl': ['86px', { lineHeight: '96px', letterSpacing: '-0.02em' }],
            '4xl': ['54px', { lineHeight: '64px', letterSpacing: '-0.02em' }],
            '3xl': ['42px', { lineHeight: '52px', letterSpacing: '-0.02em' }],
            '2xl': ['36px', { lineHeight: '42px', letterSpacing: '-0.02em' }],
            xl: ['32px', { lineHeight: '40px', letterSpacing: '-0.01em' }],
            lg: ['28px', { lineHeight: '36px', letterSpacing: '-0.01em' }],
            md: ['24px', { lineHeight: '32px', letterSpacing: '-0.01em' }],
            smd: ['20px', { lineHeight: '25px' }],
            base: '16px',
            sm: '14px',
            xs: '12px',
            '2xs': ['10px', { lineHeight: '15px' }],
        },
        colors: {
            // Primary
            universeBlue: '#002133',
            horizonBlue: '#3555AC',
            teal: '#11CABE',
            green: '#5CD167',
            orange: '#F9AA4B',
            yellow: '#FAAD14',
            red: '#FA2256',
            purple: '#BD47FB',
            gunMetal: '#292D3F',
            primary7: '#11CABE',

            // Secondary
            galacticOrange: '#FF9FAE',
            planetaryPurple: '#ADB6FF',
            nebulaTeal: '#15D6E8',
            secondaryPurple: '#AE72FF',
            moonGrey: '#E6E6E6',
            slateGray: '#777E90',
            secondary7: '#B9BDEA',

            neutral: {
                DEFAULT: '#353945',
                '1': '#141416',
                '2': '#23262F',
                '3': '#353945',
                '4': '#777E91',
                '5': '#B1B5C4',
                '6': '#E6E8EC',
                '7': '#F4F5F6',
                '8': '#FCFCFD',
                '50': '#FBFAFC',
                '300': '#CBD5E1',
                '500': '#64748B',
                '600': '#475569',
                '700': '#334155',
                '800': '#1E293B',
                '900': '#002133',
            },
            grayScale: '#FAFAFA',

            tabGradient2: 'rgba(106, 118, 177, 0.35)',
            tabGradient1: 'rgba(57, 77, 174, 0)',
            backgroundBlur: 'rgba(35, 43, 56, 0.6)',
            cardBackground: '#161E2E',
            panelStroke: 'rgb(45, 64, 100)',

            progressBarStart: 'rgba(21, 214, 232, 1)',
            progressBarVia: 'rgba(255, 188, 107, 1)',
            progressBarEnd: 'rgba(255, 101, 138, 1)',

            transparent: 'transparent',
            starBlue: {
                '80': 'rgba(81, 98, 255, 0.8)',
                '60': 'rgba(81, 98, 255, 0.6)',
                '40': 'rgba(81, 98, 255, 0.4)',
                '30': 'rgba(81, 98, 255, 0.3)',
                '20': 'rgba(81, 98, 255, 0.2)',
                '10': 'rgba(81, 98, 255, 0.1)',
                DEFAULT: '#5162FF',
            },

            black: {
                DEFAULT: '#000000',
                '90': 'rgba(0, 0, 0, 0.9)',
                '80': 'rgba(0, 0, 0, 0.8)',
                '70': 'rgba(0, 0, 0, 0.7)',
                '60': 'rgba(0, 0, 0, 0.6)',
                '50': 'rgba(0, 0, 0, 0.5)',
                '40': 'rgba(0, 0, 0, 0.4)',
                '30': 'rgba(0, 0, 0, 0.3)',
                '20': 'rgba(0, 0, 0, 0.2)',
                '10': 'rgba(0, 0, 0, 0.1)',
            },
            white: {
                DEFAULT: '#FFFFFF',
                '90': 'rgba(255, 255, 255, 0.9)',
                '80': 'rgba(255, 255, 255, 0.8)',
                '70': 'rgba(255, 255, 255, 0.7)',
                '60': 'rgba(255, 255, 255, 0.6)',
                '50': 'rgba(255, 255, 255, 0.5)',
                '40': 'rgba(255, 255, 255, 0.4)',
                '30': 'rgba(255, 255, 255, 0.3)',
                '20': 'rgba(255, 255, 255, 0.2)',
                '10': 'rgba(255, 255, 255, 0.1)',
                '5': 'rgba(255, 255, 255, 0.05)',
            },
            chart: {
                fil: '#0090FF',
                btc: '#F9A137',
                eth: '#B9BDEA',
                usdc: '#2775CA',
            },
            pill: {
                fil: 'rgba(0, 144, 255, 0.7)',
                btc: 'rgba(249, 159, 50, 0.7)',
                eth: 'rgba(131, 131, 133, 0.7)',
                usdc: '#2775CA',
            },
        },
    },
    plugins: [],
};
