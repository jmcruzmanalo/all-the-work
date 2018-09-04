import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import Slider, { Handles, Tracks, Ticks } from 'react-compound-slider';
import Track from './Track';
import Handle from './Handle';
import Tick from './Tick';

const HiddenOverflow = styled.div`
  overflow: hidden;
`;

const MultiPointSlider = ({ domain, values = [], onChange, onUpdate }) => {
  return (
    <HiddenOverflow>
      <Slider
        domain={domain}
        step={50}
        mode={3}
        rootStyle={{
          position: 'relative',
          display: 'block',
          marginLeft: 'auto',
          marginRight: 'auto',
          marginBottom: '35px',
          width: 'calc(100% - 40px)',
          height: '45px',
          paddingTop: '20px'
        }}
        values={values}
        onChange={
          onChange ? onChange : () => console.log('No onChange available')
        }
        onUpdate={onUpdate}
      >
        <Handles>
          {({ handles, getHandleProps }) => (
            <div className="slider-handles">
              {handles.map(handle => (
                <Handle
                  key={handle.id}
                  handle={handle}
                  domain={domain}
                  getHandleProps={getHandleProps}
                />
              ))}
            </div>
          )}
        </Handles>

        <Tracks left={true} right={false}>
          {({ tracks, getTrackProps }) => (
            <div className="slider-tracks">
              {tracks.map(({ id, source, target }) => (
                <Track
                  key={id}
                  source={source}
                  target={target}
                  getTrackProps={getTrackProps}
                />
              ))}
            </div>
          )}
        </Tracks>

        <Ticks count={10}>
          {({ ticks }) => (
            <div className="slider-ticks">
              {ticks.map(tick => (
                <Tick key={tick.id} tick={tick} count={ticks.length} />
              ))}
            </div>
          )}
        </Ticks>

        <div
          style={{
            position: 'absolute',
            width: '100%',
            height: 8,
            borderRadius: 4,
            cursor: 'pointer',
            backgroundColor: 'rgb(100,100,100)'
          }}
        />
      </Slider>
    </HiddenOverflow>
  );
};

MultiPointSlider.propTypes = {
  domain: PropTypes.array,
  values: PropTypes.array,
  onChange: PropTypes.func,
  onUpdate: PropTypes.func
};

export default MultiPointSlider;
