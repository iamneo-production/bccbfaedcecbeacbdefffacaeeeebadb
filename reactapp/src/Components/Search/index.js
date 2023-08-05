import React, { useState } from 'react';
import isURL from 'validator/lib/isURL';

function validateUrl(url) {
  var pattern = new RegExp(
    /^(https?:\/\/)?(www\.)?[a-zA-Z0-9-]+\.[a-zA-Z]{2,3}(\/\S*)?$/
  );
  return pattern.test(url);
}
function UrlValidator() {
  const [domain, setDomain] = useState('');
  const [path, setPath] = useState('');
  const [method, setMethod] = useState('GET');
  const [body, setBody] = useState('');
  const [message, setMessage] = useState('');
  const [isRed, setRed] = useState(false);

  const handleSubmit = (event) => {
    event.preventDefault();
    let domain2 = event.target[0].value;
    let path2 = event.target[1].value;
    let method2 = event.target[2].value;
    let body2 = event.target[3].value;

    const constructedUrl = `${domain2}/${path2.split(' ').join('/')}`;
    if (!validateUrl(constructedUrl)) {
      setMessage('Invalid URL! Please recheck your URL');
      setRed(true);
    } else {
      setRed(false);
      var json;
      if (method2 === 'POST' || method2 === 'PUT') {
        try {
          json = JSON.parse(body2);
        } catch (exception) {
          json = null;
        }
        if (json) {
          //this is json
          setRed(false);
        } else {
          setMessage('Error in the Body');
          setRed(true);
          return;
        }
      }
      var extra = null;
      if (method2 === 'GET' && body2) {
        try {
          json = JSON.parse(body2);
        } catch (exception) {
          json = null;
        }
        if (json) {
          // this is json
          const query = Object.keys(json)
            .map(
              (k) => `${encodeURIComponent(k)}=${encodeURIComponent(json[k])}`
            )
            .join('&');
          extra = query;
          setRed(false);
        } else {
          setMessage('Error in the Body of the Query Params');
          setRed(true);
          return;
        }
      }
      if (extra !== null) {
        setMessage(`${constructedUrl}?${extra}`);
      } else {
        setMessage(`${constructedUrl}`);
      }
    }
  };

  return (
    <div>
      <div
        data-testid="message"
        className={message === '' ? 'dnone' : isRed ? 'cred' : 'cgreen'}
      >
        {message}
      </div>
      <form onSubmit={handleSubmit} data-testid="submit" className="forms">
        <div className="form-body">
          <label className="labelcss">Domain</label>
          <input
            name="domain"
            type="text"
            placeholder="Enter the Domain URL"
            value={domain}
            onChange={(event) => setDomain(event.target.value)}
            data-testid="domain"
          />

          <label className="labelcss">Path</label>
          <input
            type="text"
            placeholder="Enter the path variables seperated by comma"
            value={path}
            onChange={(event) => setPath(event.target.value)}
            data-testid="path"
          />

          <label className="labelcss">Method</label>
          <select
            value={method}
            onChange={(event) => setMethod(event.target.value)}
            data-testid="method"
            className="inptext"
          >
            <option className="option-v" value="GET">
              GET
            </option>
            <option value="POST" className="option-v">
              POST
            </option>
            <option value="PUT" className="option-v">
              PUT
            </option>
            <option value="DELETE" className="option-v">
              DELETE
            </option>
          </select>

          {method !== 'DELETE' && (
            <label>
              <label className="labelcss">Body</label>
              <br />
              <textarea
                placeholder="Enter the Query Params as an Object"
                value={body}
                onChange={(event) => setBody(event.target.value)}
                data-testid="body"
              />
            </label>
          )}
          <br />

          <button type="submit" name="Validate">
            Validate
          </button>
        </div>
      </form>
    </div>
  );
}

export default UrlValidator;