import * as React from "react";

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

// Copied from `io-ts`
declare const _brand: unique symbol;
interface Brand<B> {
    readonly [_brand]: B;
}
type Branded<A, B> = A & Brand<B>;

interface IntlzdBrand {
    readonly Intlzd: unique symbol;
}

type Intlzd = Branded<string, IntlzdBrand>;

const wrap = (s: string): Intlzd => s as Intlzd;

type StrictFC<P = {}> = React.FC<{ children: Intlzd } & P>;

const StrictCustomComponent: StrictFC = ({ children }) => <div>{children}</div>;

// error ✅
<StrictCustomComponent>some string</StrictCustomComponent>;
// error ✅
<StrictCustomComponent>{"some string"}</StrictCustomComponent>;
// no error ✅
<StrictCustomComponent>{wrap("some string")}</StrictCustomComponent>;

const A: StrictFC<React.ComponentPropsWithoutRef<"a"> & { title: Intlzd }> = (
    props
) => <a {...props} />;

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
    title={wrap("some string")}
>
    {/* no error ✅ */}
    {wrap("some string")}
</A>;

const Img: StrictFC<
    React.ComponentPropsWithoutRef<"img"> & { title: Intlzd; alt: Intlzd }
> = (props) => <img {...props} />;

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
    title={wrap("some string")}
    // no error ✅
    alt={wrap("some string")}
    // no error ✅
    src="foo"
/>;
