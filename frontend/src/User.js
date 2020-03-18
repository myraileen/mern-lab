import React from 'react';

const User = props => (
    <div>
        <h4>{props.user.name}</h4>
        <p>{props.user.email}</p>
    </div>
)

export default User