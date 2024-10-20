const apiURL = 'http://127.0.0.1:8000/';

export const getUsers = () => {
  const users = fetch(apiURL + 'users')
    .then((res) => {
      if (!res.ok) {
        throw new Error('Network response was not ok');
      }
      return res.json();
    })
    .then((data) => data.users)
    .catch((error) => console.log('Error: ', error));
  return users;
};

export const getAdmins = () => {
  const users = fetch(apiURL + 'admins')
    .then((res) => {
      if (!res.ok) {
        throw new Error('Network response was not ok');
      }
      return res.json();
    })
    .then((data) => data.users)
    .catch((error) => console.log('Error: ', error));
  return users;
};

export const getWfhRequests = (userId: number) => {
  const requests = fetch(apiURL + 'wfhRequests?userid=' + userId)
    .then((res) => {
      if (!res.ok) {
        throw new Error('Network response was not ok');
      }
      return res.json();
    })
    .then((data) => data.requests)
    .catch((error) => console.log('Error: ', error));
  return requests;
};

export const addWfhRequest = (wfh_req: object) => {
  const requests = fetch(apiURL + 'addWfhRequest', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(wfh_req),
  })
    .then((res) => {
      if (!res.ok) {
        throw new Error('Network response was not ok');
      }
      return res.json();
    })
    .then((data) => data.requests)
    .catch((error) => console.log('Error: ', error));
  return requests;
};

export const updateWfhRequest = (wfh_req: object) => {
  const requests = fetch(apiURL + 'editWfhRequest', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(wfh_req),
  })
    .then((res) => {
      if (!res.ok) {
        throw new Error('Network response was not ok');
      }
      return res.json();
    })
    .then((data) => data.requests)
    .catch((error) => console.log('Error: ', error));
  return requests;
};

export const deleteWfhRequest = (req_id: number) => {
  const requests = fetch(apiURL + 'deleteWfhRequest/' + req_id, {
    method: 'DELETE',
  })
    .then((res) => {
      if (!res.ok) {
        throw new Error('Network response was not ok');
      }
      return res.json();
    })
    .then((data) => data.requests)
    .catch((error) => console.log('Error: ', error));
  return requests;
};

export const approveWfhReq = (req_id: number) => {
  const requests = fetch(apiURL + 'approveWfhRequest/' + req_id, {
    method: 'PUT',
  })
    .then((res) => {
      if (!res.ok) {
        throw new Error('Network response was not ok');
      }
      return res.json();
    })
    .then((data) => data.requests)
    .catch((error) => console.log('Error: ', error));
  return requests;
};

export const rejectWfhReq = (req_id: number) => {
  const requests = fetch(apiURL + 'rejectWfhRequest/' + req_id, {
    method: 'PUT',
  })
    .then((res) => {
      if (!res.ok) {
        throw new Error('Network response was not ok');
      }
      return res.json();
    })
    .then((data) => data.requests)
    .catch((error) => console.log('Error: ', error));
  return requests;
};

export const getPendingWfhReqs = (approver_id: number) => {
  const requests = fetch(apiURL + 'adminPendingRequests/' + approver_id)
    .then((res) => {
      if (!res.ok) {
        throw new Error('Network response was not ok');
      }
      return res.json();
    })
    .then((data) => data.requests)
    .catch((error) => console.log('Error: ', error));
  return requests;
};

export const getApprovedWfhReqs = (approver_id: number) => {
  const requests = fetch(apiURL + 'adminApprovedRequests/' + approver_id)
    .then((res) => {
      if (!res.ok) {
        throw new Error('Network response was not ok');
      }
      return res.json();
    })
    .then((data) => data.requests)
    .catch((error) => console.log('Error: ', error));
  return requests;
};

export const getRejectedWfhReqs = (approver_id: number) => {
  const requests = fetch(apiURL + 'adminRejectedRequests/' + approver_id)
    .then((res) => {
      if (!res.ok) {
        throw new Error('Network response was not ok');
      }
      return res.json();
    })
    .then((data) => data.requests)
    .catch((error) => console.log('Error: ', error));
  return requests;
};
