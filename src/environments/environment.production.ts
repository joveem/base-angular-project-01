// third
import { FirebaseOptions } from "@angular/fire/app";


export const ProductionEnvironmentName = 'prod';
export const BetaEnvironmentName = 'beta';
export const DevelopmentEnvironmentName = 'dev';
export const LocalEnvironmentName = 'local';

export const environment: EnviromentData = {
    API_URL: 'https://jovdev-ws-02-production-01.up.railway.app',
    CDN_URL: 'https://jovdev-ws-02-production-01.s3.sa-east-1.amazonaws.com',
    APP_VERSION: "M.M.P",

    ENVIRONMENT_NAME: ProductionEnvironmentName,
    VAPID_PUBLIC_KEY: "*****************************************",
};

export interface EnviromentData
{
    API_URL: string,
    CDN_URL: string,
    APP_VERSION: string,

    ENVIRONMENT_NAME: string,

    VAPID_PUBLIC_KEY: string,
}

export const firebaseEnvironment: FirebaseOptions = {
    "projectId": "jovdev-ws-02",
    "appId": "INSERT-APP-ID",
    "storageBucket": "jovdev-ws-02.appspot.com",
    "apiKey": "INSERT-API-KEY",
    "authDomain": "jovdev-ws-02.firebaseapp.com",
    "messagingSenderId": "INSERT-MESSAGING-ID",
    "measurementId": "INSERT-MEASUMENT-ID"
};

export class AppEnvironmentHandler
{
    static GetEnviromentCollectionPrefix = () =>
    {
        let value = '';

        value += environment.ENVIRONMENT_NAME + '-';

        return value;
    }

    static IsProd = () =>
    {
        let value = false;

        value = environment.ENVIRONMENT_NAME == ProductionEnvironmentName

        return value;
    }

    static IsLocal = () =>
    {
        let value = false;

        value = environment.ENVIRONMENT_NAME == LocalEnvironmentName

        return value;
    }

    static DoIfProduction = (callback: () => void) =>
    {
        if (AppEnvironmentHandler.IsProd())
            callback();
    }

    static DoIfLocal = (callback: () => void) =>
    {
        if (AppEnvironmentHandler.IsLocal())
            callback();
    }
}
