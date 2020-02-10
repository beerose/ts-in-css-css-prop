/** @jsx jsx */
import { run } from "@cycle/run";
import {
  makeDOMDriver,
  MainDOMSource,
  VNode,
  VNodeData
} from "@cycle/dom";
import { Stream } from "xstream";
import { style, types } from "typestyle";
import snabbdom, { createElement } from "snabbdom-pragma";

import {
  valueToColor,
  passwordStrengthTexts
} from "./utils";

type StyleProperties =
  | types.NestedCSSProperties
  | false
  | null
  | undefined;
interface VNodeDataWithCss extends VNodeData {
  css?: StyleProperties | StyleProperties[];
}
const jsx = (
  type: string | snabbdom.Component,
  props: VNodeDataWithCss,
  ...children: snabbdom.CircularChildren[]
) => {
  if (props && props.css) {
    const { css } = props;
    const className = css
      ? style(...(Array.isArray(css) ? css : [css]))
      : "";
    const finalProps = {
      ...props,
      attrs: {
        ...props.attrs,
        class: [
          props.attrs && props.attrs.class,
          className
        ].join(" ")
      }
    };
    delete finalProps.css;
    return createElement(type, finalProps, ...children);
  }

  return createElement(type, props, ...children);
};

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace JSX {
    interface IntrinsicAttributes
      extends VNodeDataWithCss {}
  }
}

export type Sources = {
  DOM: MainDOMSource;
};
export type Sinks = {
  DOM: Stream<VNode>;
};

function main(sources: Sources) {
  const input$ = sources.DOM.select("input").events(
    "input"
  );

  const password$ = input$
    .map(
      e => e.target && (e.target as HTMLInputElement).value
    )
    .startWith("");

  const vdom$ = password$.map(password => {
    const value = Math.floor((password || "").length / 3);
    return (
      <form css={{ fontFamily: "monospace", fontSize: 20 }}>
        <label>
          <span>Password</span>
          <input
            type="password"
            css={{
              marginLeft: 20,
              fontSize: "inherit",
              fontFamily: "inherit"
            }}
          />
        </label>
        <div css={{ marginTop: 20 }}>
          <span>
            Strength: {passwordStrengthTexts(value)}
          </span>
          <meter
            value={value}
            max={4}
            css={{
              marginTop: 20,

              margin: "0 auto 1em",
              width: "100%",
              height: "0.5em",

              $nest: {
                "&::-webkit-meter-optimum-value": {
                  background: valueToColor(value)
                },

                "&::-webkit-meter-bar": {
                  background: "none",
                  backgroundColor: "rgba(0, 0, 0, 0.1)"
                }
              }
            }}
          />
        </div>
      </form>
    );
  });

  return { DOM: vdom$ };
}

run(main, { DOM: makeDOMDriver("#app") });
