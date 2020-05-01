import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Button } from 'reactstrap';
import { withSearch } from '@elastic/react-search-ui';
import FilterChips from './filter-chips';
import ProductFacet from './product-facet';
import {
  toggleMobileFacets as toggleMobileFacetsAction,
} from '../../../../modules/product-picker/actions';
import facetConfig from '../../../../modules/product-picker/facetConfig';

function Facets(props) {
  const {
    isMobile,
    browser,
    facets,
    filters,
    removeFilter,
    showMobileFacets,
    toggleMobileFacets,
  } = props;

  const showFacets = browser.greaterThan.small || showMobileFacets;
  const facetHeight = isMobile ? 'calc(100vh - 125px)' : '100%';

  return !showFacets ? null : (
    <div className="facet-container">

      <FilterChips filters={filters} removeFilter={removeFilter} />

      <div className="inner-container" style={{ height: facetHeight, overflowY: 'auto' }}>
        {facetConfig.map((config) => {
          const facet = facets[config.field];
          const data = (facet && facet.length && facet[0].data) || [];
          return (
            <ProductFacet
              key={config.field}
              field={config.field}
              label={config.label}
              filterType={config.filterType}
              tooltip={config.tooltip}
              show={config.show}
              view={config.view}
              data={data}
            />
          );
        })}
      </div>

      {isMobile && showMobileFacets && (
      <Button
        className="apply-facets"
        onClick={toggleMobileFacets}
      >
        Apply
      </Button>
      )}
    </div>
  );
}

Facets.propTypes = {
  browser: PropTypes.object,
  facets: PropTypes.object,
  filters: PropTypes.array,
  isMobile: PropTypes.bool,
  removeFilter: PropTypes.func,
  showMobileFacets: PropTypes.bool,
  toggleMobileFacets: PropTypes.func,
};

const mapDispatchToProps = (dispatch) => ({
  toggleMobileFacets: () => {
    dispatch(toggleMobileFacetsAction());
  },
});

function mapStateToProps(state, ownProps) {
  const { browser, productPicker } = state;
  const { showMobileFacets } = productPicker;

  return {
    isMobile: browser.lessThan.medium,
    showMobileFacets,
    browser,
  };
}
export default withSearch(
  ({
    facets, filters, removeFilter,
  }) => ({
    facets, filters, removeFilter,
  }),
)(connect(
  mapStateToProps,
  mapDispatchToProps,
)(Facets));
