import React from 'react';
import { Route, Switch } from 'react-router-dom';

import { Card } from 'antd';
import { List } from './List';

export { WrittingOffActs };

function WrittingOffActs({ match }) {
    const { path } = match;

    return (
          <Card hoverable title="Акты списания устройств" >
                <Switch>
                    <Route exact path={path} component={List} />
                </Switch>
            </Card>
    );
}
