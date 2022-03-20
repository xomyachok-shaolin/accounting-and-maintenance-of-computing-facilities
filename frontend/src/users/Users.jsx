import React from 'react';
import { Route, Switch } from 'react-router-dom';

import { List, AddEdit } from './';
import { Card } from 'antd';

export { Users };

function Users({ match }) {
    const { path } = match;
    
    return (
          <Card hoverable title="Управление пользователями" >
                <Switch>
                    <Route exact path={path} component={List} />
                    <Route path={`${path}/add`} component={AddEdit} />
                    <Route path={`${path}/edit/:id`} component={AddEdit} />
                </Switch>
            </Card>
    );
}
