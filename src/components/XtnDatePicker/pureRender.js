/**
 * Created by admin on 2016-10-12.
 */
export function shallowEqual(prev, next) {
  if (prev === next) return true;
  const prevKeys = Object.keys(prev);
  const nextKeys = Object.keys(next);

  if (prevKeys !== nextKeys) return false;

  return prevKeys.every((key) => {
    return prevKeys.hasOwnProperty(key) && prevKeys[key] === nextKeys[key];
  });
}

function PureRender(Component) {
  Component.prototype.shouldComponentUpdate = (nextProps, nextState)=> {
    return PureRender.shouldComponentUpdate(nextProps, nextState, this.props, this.state);
  };
}

PureRender.shouldComponentUpdate = (nextProps, nextState, preProps, preState) => {
  return !shallowEqual(preProps, nextProps) || !shallowEqual(preState, nextState);
};

export default PureRender;
