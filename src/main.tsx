import * as React from "react";

import { Newtype, iso } from "newtype-ts";

type Overwrite<A, B> = Omit<A, keyof B> & B;

//
// Example using `React.FC` and the built-in native components like `a` and `img`
//

const LooseCustomComponent: React.FC = ({ children }) => <div>{children}</div>;

// no error ❌
<LooseCustomComponent>some string</LooseCustomComponent>;

<a
    // no error ✅
    rel="nofollow"
    // no error ❌
    title="some string"
>
    {/* no error ❌ */}
    some string
</a>;

<img
    // no error ❌
    title="some string"
    // no error ❌
    alt="some string"
    // no error ✅
    src="foo"
/>;

//
// Example using a custom `FC` type and wrappers for built-in components like `a` and `img`
//

type Intlzd = Newtype<{ readonly Intlzd: unique symbol }, string>;

const isoIntlzd = iso<Intlzd>();

type StrictFC<P = {}> = React.FC<{ children: Intlzd } & P>;

const StrictCustomComponent: StrictFC = ({ children }) => <div>{children}</div>;

// error ✅
<StrictCustomComponent>some string</StrictCustomComponent>;
// error ✅
<StrictCustomComponent>{"some string"}</StrictCustomComponent>;
// no error ✅
<StrictCustomComponent>{isoIntlzd.wrap("some string")}</StrictCustomComponent>;

const A: StrictFC<
    Overwrite<React.ComponentPropsWithoutRef<"a">, { title: Intlzd }>
> = ({ title, ...restProps }) => (
    <a title={isoIntlzd.unwrap(title)} {...restProps} />
);

<A
    // no error ✅
    rel="nofollow"
    // error ✅
    title="some string"
>
    {/* error (when we comment out `title` prop) ✅ */}
    some string
</A>;

<A
    // no error ✅
    rel="nofollow"
    // no error ✅
    title={isoIntlzd.wrap("some string")}
>
    {/* no error ✅ */}
    {isoIntlzd.wrap("some string")}
</A>;

const Img: StrictFC<
    Overwrite<
        React.ComponentPropsWithoutRef<"img">,
        { title: Intlzd; alt: Intlzd }
    >
> = ({ title, alt, ...restProps }) => (
    <img
        title={isoIntlzd.unwrap(title)}
        alt={isoIntlzd.unwrap(alt)}
        {...restProps}
    />
);

<Img
    // error ✅
    title="some string"
    // error ✅
    alt="some string"
    // no error ✅
    src="foo"
/>;

<Img
    // no error ✅
    title={isoIntlzd.wrap("some string")}
    // no error ✅
    alt={isoIntlzd.wrap("some string")}
    // no error ✅
    src="foo"
/>;
