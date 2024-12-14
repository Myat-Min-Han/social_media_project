import { useRouteError } from "react-router-dom";
import React from "react";

const ErrorPage = ():React.JSX.Element => {
    const error = useRouteError();
    console.error(error);

    const errorMessage = 
        (error instanceof Error && error.message) ||
        (typeof error === 'object' && error !== null && 'statusText' in error && (error as any).statusText) ||
        'Unknown error';

    return (
    <div id="error-page">
        <h1>Oops!</h1>
        <p>Sorry, an unexpected error has occurred.</p>
        <p>
            <i>{errorMessage}</i>
        </p>
        </div>
    );
};

export default ErrorPage;