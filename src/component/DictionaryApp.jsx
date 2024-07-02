import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import FlashMessage from "./FlashMessage";

const DictionaryApp = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [query, setQuery] = useState("hello");
  const [allData, setAllData] = useState([]);
  const [flashMessage, setFlashMessage] = useState(null);

  const fetchData = async (query) => {
    try {
      const response = await fetch(
        `https://api.dictionaryapi.dev/api/v2/entries/en/${query}`
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const dataOfDic = await response.json();
      setData(dataOfDic);
      extractDefinitions(dataOfDic);
      setLoading(false);
    } catch (error) {
      setError(error.message);
      setFlashMessage({ message: error.message, type: "danger" });
      setLoading(false);
    }
  };

  useEffect(() => {
    document.title = "Dictionary";
    fetchData(query);
  }, [query]);

  const handleSearch = (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const query = formData.get("query");
    setLoading(true);
    setError(null);
    fetchData(query);
  };

  const extractDefinitions = (data) => {
    const definitions = [];
    data.forEach((item) => {
      item.meanings.forEach((meaning) => {
        meaning.definitions.forEach((definition) => {
          definitions.push({
            definition: definition.definition,
            example: definition.example || "No example available",
          });
        });
      });
    });
    setAllData(definitions);
  };

  const handleCloseFlashMessage = () => {
    setFlashMessage(null);
  };

  return (
    <div className="container d-flex flex-column align-items-center mt-5">
      {flashMessage && (
        <FlashMessage
          message={flashMessage.message}
          type={flashMessage.type}
          onClose={handleCloseFlashMessage}
        />
      )}
      <h1 className="mb-4">DictionaryApp</h1>

      <form
        className="d-flex justify-content-center mb-4"
        onSubmit={handleSearch}
      >
        <div className="me-2">
          <label htmlFor="query" className="form-label">
            Add word:
          </label>
          <input
            type="text"
            className="form-control"
            name="query"
            id="query"
            placeholder="Enter a word"
          />
        </div>
        <button type="submit" className="btn btn-primary align-self-end">
          Search
        </button>
      </form>

      <div className="card w-75">
        <div className="card-body">
          {allData.slice(0, 1).map((item, index) => (
            <div key={index}>
              <p className="card-text">
                <strong>Definition:</strong> {item.definition}
              </p>
              <p className="card-text">
                <strong>Example:</strong> {item.example}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DictionaryApp;
