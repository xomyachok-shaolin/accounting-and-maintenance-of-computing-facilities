import React from 'react';
import { Route, Switch } from 'react-router-dom';

import { Card } from 'antd';
import { List } from './List';

export { WorkstationDevices };

function WorkstationDevices({ match }) {
    const { path } = match;

    return (
          <Card hoverable title="Оборудование на рабочих местах" >
                <Switch>
                    <Route exact path={path} component={List} />
                </Switch>
            </Card>
    );
}
