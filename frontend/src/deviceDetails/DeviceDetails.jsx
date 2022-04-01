import React from 'react';
import { Route, Switch } from 'react-router-dom';

import { Card } from 'antd';
import { List } from './List';

export { DeviceDetails };

function DeviceDetails({ match }) {
    const { path } = match;
    
    return (
          <Card hoverable title="Сведения об устройствах" >
                <Switch>
                    <Route exact path={path} component={List} />
                </Switch>
            </Card>
    );
}
