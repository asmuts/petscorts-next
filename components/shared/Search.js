import React, { useState } from "react";
import { useRouter } from "next/router";
import { Form, FormControl, Button } from "react-bootstrap";

const Search = (props) => {
  const router = useRouter();
  const [query, setQuery] = useState("");

  const preventDefault = (f) => (e) => {
    e.preventDefault();
    f(e);
  };

  const handleParam = (setValue) => (e) => setValue(e.target.value);

  const handleSubmit = preventDefault(() => {
    console.log(query);
    router.push({
      pathname: "/pet-search-results",
      query: { q: query },
    });
  });

  return (
    <Form inline onSubmit={handleSubmit}>
      <FormControl
        onChange={handleParam(setQuery)}
        type="text"
        value={query}
        placeholder="&#xF002; Search by city"
        className="btn-pet-search mr-sm-2 mx-auto rounded-pill fa pet-search"
      />
      <Button
        onClick={handleSubmit}
        variant="outline-primary"
        className="btn-pet-search rounded-circle d-none d-sm-none d-md-block"
      >
        <i className="fa fa-search" aria-hidden="true"></i>
      </Button>
    </Form>
  );
};

export default Search;
