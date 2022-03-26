import React from 'react';
import { Route, Switch } from 'react-router-dom';

import { Card } from 'antd';
import { List } from './List';

export { Roles };

function Roles({ match }) {
    const { path } = match;
    
    return (
          <Card hoverable title="Управление ролями" >
                <Switch>
                    <Route exact path={path} component={List} />
                </Switch>
            </Card>
    );
}
