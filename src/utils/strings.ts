import { formatDate } from '@secured-finance/sf-core';
import { Option } from 'src/components/atoms';
import { getEnvironment } from './env';
export enum Environment {
    DEVELOPMENT = 'development',
    STAGING = 'staging',
}

export const formatDataCy = (str: string): string => {
    return str.replace(/\s+/g, '-').toLowerCase();
};

export function getTransformMaturityOption(options: Option[]) {
    return (label: string) => {
        const ts = options.find(o => o.label === label)?.value;
        if (!ts || isNaN(Number(ts))) {
            return label;
        }

        return formatDate(Number(ts));
    };
}

export const getEnvShort = () => {
    const env = getEnvironment();
    switch (env.toLowerCase()) {
        case Environment.DEVELOPMENT:
            return 'dev';
        case Environment.STAGING:
            return 'stg';
        default:
            return '';
    }
};

export const prefixTilde = (value: string): string => {
    return value ? `~ ${value}` : '';
};
