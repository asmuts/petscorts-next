import React, { Fragment, useState } from "react";
import { useRouter } from "next/router";
import { AsyncTypeahead, Hint } from "react-bootstrap-typeahead";
//import throttle from "lodash/throttle";

const SEARCH_CITYNAME_URI = process.env.NEXT_PUBLIC_API_SERVER_URI;
const SEARCH_CITYNAME_URL = SEARCH_CITYNAME_URI + "/api/v1/cities/name/";

const SearchRBT = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [options, setOptions] = useState([]);

  const handleSearch = (query) => {
    setIsLoading(true);

    // const fetch = React.useMemo(
    //   () =>
    //     throttle((request, callback) => {
    //       autocompleteService.current.getPlacePredictions(request, callback);
    //     }, 200),
    //   [],
    // );
    //fetch({ input: inputValue }, (results) => {

    // cut the state out of the search
    let toSearch = query.split(",")[0];
    fetch(`${SEARCH_CITYNAME_URL}${toSearch}`)
      .then((resp) => resp.json())
      .then(({ data }) => {
        const options = data.map((i) => ({
          city: i.city,
          state: i.state_id,
          city_state: i.city + ", " + i.state_id,
        }));

        setOptions(options);
        setIsLoading(false);
      });
  };

  const handleSubmit = (option) => {
    // ignore empty onChange calls
    if (option[0] && option[0].city_state) {
      const city_state = option[0].city_state;
      //setOptions([{ delay: "100" }]);
      setIsLoading(false);
      //?q=${city_state}`

      setOptions([]);

      const query = { type: "city_state", q: `${city_state}` };
      const url = { pathname: "/pets", query };
      const asUrl = { pathname: "/pets", query };
      router.push(url, asUrl);
    }
  };

  // Bypass client-side filtering by returning `true`.
  const filterBy = () => true;

  //////////////////////////////////////////////////////////////
  return (
    <AsyncTypeahead
      className="btn-pet-search mr-sm-2 mx-auto rounded-pill fa pet-search"
      filterBy={filterBy}
      id="async"
      isLoading={isLoading}
      labelKey="city_state"
      minLength={2}
      onSearch={handleSearch}
      options={options}
      selectHintOnEnter={true}
      placeholder="Search by city..."
      renderMenuItemChildren={(option, props) => (
        <Fragment>
          <span>{option.city_state}</span>
        </Fragment>
      )}
      onChange={handleSubmit}
    />
  );
};

export default SearchRBT;
