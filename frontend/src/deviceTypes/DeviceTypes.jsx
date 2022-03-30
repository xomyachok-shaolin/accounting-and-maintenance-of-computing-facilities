import React from 'react';
import { Route, Switch } from 'react-router-dom';

import { Card } from 'antd';
import { List } from './List';

export { DeviceTypes };

function DeviceTypes({ match }) {
    const { path } = match;
    
    return (
          <Card hoverable title="Управление видами устройств" >
                <Switch>
                    <Route exact path={path} component={List} />
                </Switch>
            </Card>
    );
}
