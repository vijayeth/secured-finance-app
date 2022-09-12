import { Route, Switch } from 'react-router-dom';

export const Layout = ({
    routes,
    navBar,
}: {
    routes: Readonly<
        Array<{
            path: string;
            component: React.ReactNode;
        }>
    >;
    navBar: React.ReactNode;
}) => {
    return (
        <div
            className='grid h-screen overflow-x-auto pb-8'
            data-testid='wrapper-div'
        >
            <header>{navBar}</header>
            <main>
                <Switch>
                    {routes.map(({ path, component }) => (
                        <Route path={path} key={path}>
                            {component}
                        </Route>
                    ))}
                </Switch>
            </main>
        </div>
    );
};
