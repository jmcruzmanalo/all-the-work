import React, { Component } from 'react';
import Slider, { Handles, Tracks, Ticks } from 'react-compound-slider';
import Track from './Track';
import Handle from './Handle';
import Tick from './Tick';

const domain = [0, 5000];
const defaultValues = [1000, 2000, 3000, 4000, 5000];

const MultiPointSlider = () => {
  return (

    <Slider
      domain={domain}
      step={100}
      mode={2}
      rootStyle={{
        position: "relative",
        width: "100%"
      }}
      values={defaultValues}
      onChange={(value) => {
        console.log(value);
      }}
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

      <Ticks count={20}>
        {({ ticks }) => (
          <div className="slider-ticks">
            {ticks.map(tick => (
              <Tick key={tick.id} tick={tick} count={ticks.length} />
            ))}
          </div>
        )}
      </Ticks>

      <div style={{
        position: "absolute",
        width: "100%",
        height: 8,
        borderRadius: 4,
        cursor: "pointer",
        backgroundColor: "rgb(100,100,100)"
      }}></div>

    </Slider>

  );
}

export default MultiPointSlider;