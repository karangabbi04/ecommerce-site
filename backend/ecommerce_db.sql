--
-- PostgreSQL database dump
--

\restrict 0ClhJ16MY9xpXrvm4fvLCLCfjE0vY7P4ASYBs6BaLhJYseipaniR41RBmVaz07R

-- Dumped from database version 18.3 (Debian 18.3-1.pgdg13+1)
-- Dumped by pg_dump version 18.3 (Debian 18.3-1.pgdg13+1)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: CheckoutStatus; Type: TYPE; Schema: public; Owner: karan
--

CREATE TYPE public."CheckoutStatus" AS ENUM (
    'ACTIVE',
    'PAYMENT_PENDING',
    'PAID',
    'EXPIRED',
    'CANCELLED'
);


ALTER TYPE public."CheckoutStatus" OWNER TO karan;

--
-- Name: OrderStatus; Type: TYPE; Schema: public; Owner: karan
--

CREATE TYPE public."OrderStatus" AS ENUM (
    'PENDING',
    'CONFIRMED',
    'PROCESSING',
    'SHIPPED',
    'DELIVERED',
    'CANCELLED',
    'REFUNDED'
);


ALTER TYPE public."OrderStatus" OWNER TO karan;

--
-- Name: OtpPurpose; Type: TYPE; Schema: public; Owner: karan
--

CREATE TYPE public."OtpPurpose" AS ENUM (
    'SIGNUP',
    'LOGIN',
    'RESET_PASSWORD',
    'CHANGE_EMAIL',
    'ORDER_CONFIRMATION'
);


ALTER TYPE public."OtpPurpose" OWNER TO karan;

--
-- Name: PaymentGateway; Type: TYPE; Schema: public; Owner: karan
--

CREATE TYPE public."PaymentGateway" AS ENUM (
    'RAZORPAY'
);


ALTER TYPE public."PaymentGateway" OWNER TO karan;

--
-- Name: PaymentRecordStatus; Type: TYPE; Schema: public; Owner: karan
--

CREATE TYPE public."PaymentRecordStatus" AS ENUM (
    'PENDING',
    'SUCCESS',
    'FAILED',
    'REFUNDED'
);


ALTER TYPE public."PaymentRecordStatus" OWNER TO karan;

--
-- Name: PaymentStatus; Type: TYPE; Schema: public; Owner: karan
--

CREATE TYPE public."PaymentStatus" AS ENUM (
    'PENDING',
    'PAID',
    'FAILED',
    'REFUNDED'
);


ALTER TYPE public."PaymentStatus" OWNER TO karan;

--
-- Name: ProductStatus; Type: TYPE; Schema: public; Owner: karan
--

CREATE TYPE public."ProductStatus" AS ENUM (
    'ACTIVE',
    'DRAFT',
    'ARCHIVED'
);


ALTER TYPE public."ProductStatus" OWNER TO karan;

--
-- Name: Role; Type: TYPE; Schema: public; Owner: karan
--

CREATE TYPE public."Role" AS ENUM (
    'USER',
    'ADMIN',
    'STAFF'
);


ALTER TYPE public."Role" OWNER TO karan;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: Address; Type: TABLE; Schema: public; Owner: karan
--

CREATE TABLE public."Address" (
    id text NOT NULL,
    "userId" text,
    "fullName" text NOT NULL,
    phone text NOT NULL,
    "addressLine1" text NOT NULL,
    city text NOT NULL,
    state text NOT NULL,
    country text NOT NULL,
    "postalCode" text NOT NULL,
    "isDefault" boolean DEFAULT false NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    latitude numeric(10,7),
    longitude numeric(10,7),
    "guestId" text,
    landmark text,
    email text
);


ALTER TABLE public."Address" OWNER TO karan;

--
-- Name: Cart; Type: TABLE; Schema: public; Owner: karan
--

CREATE TABLE public."Cart" (
    id text NOT NULL,
    "userId" text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "guestId" text
);


ALTER TABLE public."Cart" OWNER TO karan;

--
-- Name: CartItem; Type: TABLE; Schema: public; Owner: karan
--

CREATE TABLE public."CartItem" (
    id text NOT NULL,
    "cartId" text NOT NULL,
    "productId" text NOT NULL,
    quantity integer DEFAULT 1 NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."CartItem" OWNER TO karan;

--
-- Name: CheckoutItem; Type: TABLE; Schema: public; Owner: karan
--

CREATE TABLE public."CheckoutItem" (
    id text NOT NULL,
    "checkoutSessionId" text NOT NULL,
    "productId" text NOT NULL,
    "productName" text NOT NULL,
    quantity integer NOT NULL,
    "unitPrice" numeric(10,2) NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public."CheckoutItem" OWNER TO karan;

--
-- Name: CheckoutSession; Type: TABLE; Schema: public; Owner: karan
--

CREATE TABLE public."CheckoutSession" (
    id text NOT NULL,
    "userId" text,
    status public."CheckoutStatus" DEFAULT 'ACTIVE'::public."CheckoutStatus" NOT NULL,
    subtotal numeric(10,2) NOT NULL,
    shipping numeric(10,2) NOT NULL,
    total numeric(10,2) NOT NULL,
    tax numeric(10,2) NOT NULL,
    "expiresAt" timestamp(3) without time zone NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "guestId" text,
    "addressId" text
);


ALTER TABLE public."CheckoutSession" OWNER TO karan;

--
-- Name: EmailOTP; Type: TABLE; Schema: public; Owner: karan
--

CREATE TABLE public."EmailOTP" (
    id text NOT NULL,
    email text NOT NULL,
    "otpHash" text NOT NULL,
    purpose public."OtpPurpose" DEFAULT 'SIGNUP'::public."OtpPurpose" NOT NULL,
    "expiresAt" timestamp(3) without time zone NOT NULL,
    attempts integer DEFAULT 0 NOT NULL,
    "maxAttempts" integer DEFAULT 5 NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    metadata jsonb,
    "varifiedAt" timestamp(3) without time zone,
    verified boolean DEFAULT false NOT NULL
);


ALTER TABLE public."EmailOTP" OWNER TO karan;

--
-- Name: Order; Type: TABLE; Schema: public; Owner: karan
--

CREATE TABLE public."Order" (
    id text NOT NULL,
    "orderNumber" text NOT NULL,
    "userId" text,
    "guestId" text,
    "customerName" text NOT NULL,
    "customerEmail" text,
    "customerPhone" text NOT NULL,
    "addressId" text NOT NULL,
    status public."OrderStatus" DEFAULT 'PENDING'::public."OrderStatus" NOT NULL,
    "paymentStatus" public."PaymentStatus" DEFAULT 'PENDING'::public."PaymentStatus" NOT NULL,
    subtotal numeric(10,2) NOT NULL,
    tax numeric(10,2) NOT NULL,
    shipping numeric(10,2) NOT NULL,
    discount numeric(10,2) DEFAULT 0 NOT NULL,
    total numeric(10,2) NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "addressSnapshot" jsonb
);


ALTER TABLE public."Order" OWNER TO karan;

--
-- Name: OrderCounter; Type: TABLE; Schema: public; Owner: karan
--

CREATE TABLE public."OrderCounter" (
    id integer NOT NULL,
    value integer DEFAULT 0 NOT NULL
);


ALTER TABLE public."OrderCounter" OWNER TO karan;

--
-- Name: OrderItem; Type: TABLE; Schema: public; Owner: karan
--

CREATE TABLE public."OrderItem" (
    id text NOT NULL,
    "orderId" text NOT NULL,
    "productId" text NOT NULL,
    "productName" text NOT NULL,
    quantity integer NOT NULL,
    "unitPrice" numeric(10,2) NOT NULL,
    "totalPrice" numeric(10,2) NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public."OrderItem" OWNER TO karan;

--
-- Name: Payment; Type: TABLE; Schema: public; Owner: karan
--

CREATE TABLE public."Payment" (
    id text NOT NULL,
    "orderId" text NOT NULL,
    gateway public."PaymentGateway" NOT NULL,
    "razorpayOrderId" text,
    "razorpayPaymentId" text,
    "razorpaySignature" text,
    amount numeric(10,2) NOT NULL,
    status public."PaymentRecordStatus" DEFAULT 'PENDING'::public."PaymentRecordStatus" NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."Payment" OWNER TO karan;

--
-- Name: Product; Type: TABLE; Schema: public; Owner: karan
--

CREATE TABLE public."Product" (
    id text NOT NULL,
    name text NOT NULL,
    description text,
    price numeric(10,2) NOT NULL,
    category text,
    stock integer DEFAULT 0 NOT NULL,
    "imageUrl" text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "oldPrice" numeric(10,2),
    slug text NOT NULL,
    tag text,
    status public."ProductStatus" DEFAULT 'ACTIVE'::public."ProductStatus" NOT NULL
);


ALTER TABLE public."Product" OWNER TO karan;

--
-- Name: ProductImage; Type: TABLE; Schema: public; Owner: karan
--

CREATE TABLE public."ProductImage" (
    id text NOT NULL,
    url text NOT NULL,
    "publicId" text NOT NULL,
    "productId" text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public."ProductImage" OWNER TO karan;

--
-- Name: User; Type: TABLE; Schema: public; Owner: karan
--

CREATE TABLE public."User" (
    id text NOT NULL,
    email text NOT NULL,
    name text,
    "emailVerified" boolean DEFAULT false NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    role public."Role" DEFAULT 'USER'::public."Role" NOT NULL,
    password text,
    phone text
);


ALTER TABLE public."User" OWNER TO karan;

--
-- Name: _prisma_migrations; Type: TABLE; Schema: public; Owner: karan
--

CREATE TABLE public._prisma_migrations (
    id character varying(36) NOT NULL,
    checksum character varying(64) NOT NULL,
    finished_at timestamp with time zone,
    migration_name character varying(255) NOT NULL,
    logs text,
    rolled_back_at timestamp with time zone,
    started_at timestamp with time zone DEFAULT now() NOT NULL,
    applied_steps_count integer DEFAULT 0 NOT NULL
);


ALTER TABLE public._prisma_migrations OWNER TO karan;

--
-- Data for Name: Address; Type: TABLE DATA; Schema: public; Owner: karan
--

COPY public."Address" (id, "userId", "fullName", phone, "addressLine1", city, state, country, "postalCode", "isDefault", "createdAt", "updatedAt", latitude, longitude, "guestId", landmark, email) FROM stdin;
6ad3ad7b-4f50-45a2-bf72-bee735e0962f	\N	sfsfds 	9999999999	sfsafafsaf asdafa 	Moonak Tahsil	Punjab	india	148033	f	2026-07-16 05:09:20.3	2026-07-16 05:09:20.3	\N	\N	\N	 indian oil petrol pump 	karanramghria58@gmail.com
f99bccd0-6b2d-4c1b-9208-913f7959e7dc	\N	sfsfds 	9999999999	kalfl sdfak. afda. adfaf sdaf	SDH Moonak	Punjab	india	148033	f	2026-07-16 05:11:05.522	2026-07-16 05:11:05.522	\N	\N	\N	 indian oil petrol pump 	karanramghria58@gmail.com
6996edd0-5075-491f-b792-6abd6d0585bb	\N	Karan	9876543210	House 123	Karimpur	Punjab	india	143515	f	2026-07-16 05:14:04.451	2026-07-16 05:14:04.451	31.2300000	75.6500000	\N	Near School	karanramghria58@gmail.com
cfd551ce-2e7f-490c-8b92-178d10c7ff0b	\N	Karan	9876543210	House 123	Karimpur	Punjab	india	143515	f	2026-07-16 05:16:05.646	2026-07-16 05:16:05.646	31.2300000	75.6500000	\N	Near School	karanramghria58@gmail.com
5b039e2a-8386-4d2b-84e8-d15703dc5156	\N	Karan	9876543210	House 123	Karimpur	Punjab	India	143515	f	2026-07-16 05:45:15.382	2026-07-16 05:45:15.382	31.2300000	75.6500000	guest_1e0e0c3d-8363-40e5-a85e-18284e5ea526	Near School	karanramghria58@gmail.com
db616ba5-1f00-4987-9d39-f231c409bf62	\N	sfsfds 	9999999999	asfaf asfdaf af	SDH Moonak	Punjab	India	148033	f	2026-07-16 06:00:47.639	2026-07-16 06:00:47.639	\N	\N	guest_454ff8cb-9455-43ec-a845-19a881a54463	 indian oil petrol pump 	karanramghria58@gmail.com
\.


--
-- Data for Name: Cart; Type: TABLE DATA; Schema: public; Owner: karan
--

COPY public."Cart" (id, "userId", "createdAt", "updatedAt", "guestId") FROM stdin;
a6575dda-8b76-4bab-912b-12e599ef78e5	\N	2026-06-24 14:52:52.105	2026-06-24 14:52:52.105	guest_11d42fa2-96ae-4386-b714-f04294266f2c
8ebf1770-fbe4-4706-9751-2b6b77d12f23	\N	2026-07-08 15:51:35.845	2026-07-08 15:51:35.845	guest_454ff8cb-9455-43ec-a845-19a881a54463
df2116a2-1216-42aa-ac93-b59a439c6243	\N	2026-07-10 15:58:45.556	2026-07-10 15:58:45.556	guest_1e0e0c3d-8363-40e5-a85e-18284e5ea526
\.


--
-- Data for Name: CartItem; Type: TABLE DATA; Schema: public; Owner: karan
--

COPY public."CartItem" (id, "cartId", "productId", quantity, "createdAt", "updatedAt") FROM stdin;
cmrc99osn0002ztr9qmbwlmb9	8ebf1770-fbe4-4706-9751-2b6b77d12f23	48ca94ea-1174-4511-bc2e-f38eea326bf9	1	2026-07-08 15:51:35.879	2026-07-08 15:52:09.33
cmrf6svuo00005xr96rumz563	df2116a2-1216-42aa-ac93-b59a439c6243	05fcfdf4-5e83-4a84-bb01-e6b12f517aed	2	2026-07-10 17:05:51.168	2026-07-11 04:12:39.516
cmrj4ku5i000e11r947gsh2k6	8ebf1770-fbe4-4706-9751-2b6b77d12f23	2e3a39f5-ce8f-4388-b177-b2e3117af97e	2	2026-07-13 11:14:41.19	2026-07-13 11:14:41.19
cmrj4l850000f11r970w75cca	8ebf1770-fbe4-4706-9751-2b6b77d12f23	3940aa77-8908-43ea-82ba-fe6435df1e20	1	2026-07-13 11:14:59.316	2026-07-13 11:14:59.316
\.


--
-- Data for Name: CheckoutItem; Type: TABLE DATA; Schema: public; Owner: karan
--

COPY public."CheckoutItem" (id, "checkoutSessionId", "productId", "productName", quantity, "unitPrice", "createdAt") FROM stdin;
cmqs70e4s000akar9hki7s4zd	cmqs70e4c0009kar97eu7uked	3940aa77-8908-43ea-82ba-fe6435df1e20	alchoal cup	1	800.00	2026-06-24 14:52:59.404
cmqs70e5m000ckar9oyemgwnd	cmqs70e5f000bkar9z5ibg158	3940aa77-8908-43ea-82ba-fe6435df1e20	alchoal cup	1	800.00	2026-06-24 14:52:59.434
cmqs7p2380002qor9iuf85sbg	cmqs7p22h0000qor9rrnvwn4a	3940aa77-8908-43ea-82ba-fe6435df1e20	alchoal cup	1	800.00	2026-06-24 15:12:10.196
cmqs7p23b0003qor9bjde1sy7	cmqs7p22j0001qor9wi5izskb	3940aa77-8908-43ea-82ba-fe6435df1e20	alchoal cup	1	800.00	2026-06-24 15:12:10.199
cmqs8fdn80006qor9cw8qab0r	cmqs8fdms0004qor9cl2koys4	3940aa77-8908-43ea-82ba-fe6435df1e20	alchoal cup	1	800.00	2026-06-24 15:32:38.228
cmqs8fdnb0007qor9erec4iuv	cmqs8fdmu0005qor9dywf9gw8	3940aa77-8908-43ea-82ba-fe6435df1e20	alchoal cup	1	800.00	2026-06-24 15:32:38.231
cmqs930dy000386r9768w353a	cmqs930dr000186r9kwonxzd1	3940aa77-8908-43ea-82ba-fe6435df1e20	alchoal cup	1	800.00	2026-06-24 15:51:00.79
cmqs930dx000286r9vq7hhf58	cmqs930dp000086r9s513o9h5	3940aa77-8908-43ea-82ba-fe6435df1e20	alchoal cup	1	800.00	2026-06-24 15:51:00.789
cmqsa44z000032yr911xskrgt	cmqsa44yt00012yr9ejts105l	3940aa77-8908-43ea-82ba-fe6435df1e20	alchoal cup	1	800.00	2026-06-24 16:19:53.004
cmqsa44yz00022yr9vx0u4k58	cmqsa44ys00002yr92n4lf28a	3940aa77-8908-43ea-82ba-fe6435df1e20	alchoal cup	1	800.00	2026-06-24 16:19:53.003
cmrc9aoym0006ztr94rpoqke1	cmrc9aoxv0004ztr92c7hy7uq	48ca94ea-1174-4511-bc2e-f38eea326bf9	jeck denial bottel lemp	1	1000.00	2026-07-08 15:52:22.75
cmrc9aoyn0008ztr9uxwgtsk6	cmrc9aoxw0005ztr9pg3si9ei	48ca94ea-1174-4511-bc2e-f38eea326bf9	jeck denial bottel lemp	1	1000.00	2026-07-08 15:52:22.751
cmrc9aoyn0009ztr9utcwa5r6	cmrc9aoxw0005ztr9pg3si9ei	2e3a39f5-ce8f-4388-b177-b2e3117af97e	botel glass set	2	444.00	2026-07-08 15:52:22.751
cmrc9aoym0007ztr9ebb49191	cmrc9aoxv0004ztr92c7hy7uq	2e3a39f5-ce8f-4388-b177-b2e3117af97e	botel glass set	2	444.00	2026-07-08 15:52:22.75
cmrf7n34j0001bgr9kjozggh6	cmrf7n34c0000bgr984qfep2u	05fcfdf4-5e83-4a84-bb01-e6b12f517aed	snake tray	1	1400.00	2026-07-10 17:29:20.275
cmrfugyc100019yr90045xdfc	cmrfugybl00009yr92bp4n9bv	05fcfdf4-5e83-4a84-bb01-e6b12f517aed	snake tray	1	1400.00	2026-07-11 04:08:25.297
cmrfvct0z000111r9mvh72j53	cmrfvct0f000011r9ndoru3ej	48ca94ea-1174-4511-bc2e-f38eea326bf9	jeck denial bottel lemp	1	1000.00	2026-07-11 04:33:11.412
cmrfvct1t000311r9rvt6kv86	cmrfvct1q000211r9li2qv36b	48ca94ea-1174-4511-bc2e-f38eea326bf9	jeck denial bottel lemp	1	1000.00	2026-07-11 04:33:11.441
cmrg1rdlg000511r9xvuxd8xv	cmrg1rdiz000411r92212l17e	48ca94ea-1174-4511-bc2e-f38eea326bf9	jeck denial bottel lemp	1	1000.00	2026-07-11 07:32:28.948
cmrg5meqa000711r99tzml4j1	cmrg5meob000611r916mewqos	48ca94ea-1174-4511-bc2e-f38eea326bf9	jeck denial bottel lemp	1	1000.00	2026-07-11 09:20:35.602
cmrgc0rp8000911r9ts9mky00	cmrgc0rn5000811r9x1c2617h	48ca94ea-1174-4511-bc2e-f38eea326bf9	jeck denial bottel lemp	1	1000.00	2026-07-11 12:19:43.292
cmriymx0b000b11r96yptp8ww	cmriymwyh000a11r9olv5xw3h	48ca94ea-1174-4511-bc2e-f38eea326bf9	jeck denial bottel lemp	1	1000.00	2026-07-13 08:28:20.507
cmrizywm2000d11r9eo4e99d6	cmrizywgx000c11r9ile7sq8n	48ca94ea-1174-4511-bc2e-f38eea326bf9	jeck denial bottel lemp	1	1000.00	2026-07-13 09:05:39.482
cmrj4ld6b000h11r9llhsknjp	cmrj4ld5r000g11r9f4n80mwk	48ca94ea-1174-4511-bc2e-f38eea326bf9	jeck denial bottel lemp	1	1000.00	2026-07-13 11:15:05.844
cmrj4ld6c000i11r9b2uoic9q	cmrj4ld5r000g11r9f4n80mwk	2e3a39f5-ce8f-4388-b177-b2e3117af97e	botel glass set	2	444.00	2026-07-13 11:15:05.844
cmrj4ld6c000j11r96unr86v3	cmrj4ld5r000g11r9f4n80mwk	3940aa77-8908-43ea-82ba-fe6435df1e20	alchoal cup	1	800.00	2026-07-13 11:15:05.844
cmrkujlmv000m11r9dhscyacf	cmrkujlle000l11r9zdh9mtku	48ca94ea-1174-4511-bc2e-f38eea326bf9	jeck denial bottel lemp	1	1000.00	2026-07-14 16:09:19.687
cmrkujlmv000n11r9j7qw0wxr	cmrkujlle000l11r9zdh9mtku	2e3a39f5-ce8f-4388-b177-b2e3117af97e	botel glass set	2	444.00	2026-07-14 16:09:19.687
cmrkujlmx000o11r90xuuqver	cmrkujlle000l11r9zdh9mtku	3940aa77-8908-43ea-82ba-fe6435df1e20	alchoal cup	1	800.00	2026-07-14 16:09:19.687
cmrkujlna000p11r9u5lk4u8d	cmrkujllc000k11r9cngsjsv0	48ca94ea-1174-4511-bc2e-f38eea326bf9	jeck denial bottel lemp	1	1000.00	2026-07-14 16:09:19.702
cmrkujlna000q11r9scjb3wpu	cmrkujllc000k11r9cngsjsv0	2e3a39f5-ce8f-4388-b177-b2e3117af97e	botel glass set	2	444.00	2026-07-14 16:09:19.702
cmrkujlna000r11r99cup7ppf	cmrkujllc000k11r9cngsjsv0	3940aa77-8908-43ea-82ba-fe6435df1e20	alchoal cup	1	800.00	2026-07-14 16:09:19.702
cmrkwakja000t11r9gi6xpzwv	cmrkwakhq000s11r9vssa3reg	48ca94ea-1174-4511-bc2e-f38eea326bf9	jeck denial bottel lemp	1	1000.00	2026-07-14 16:58:17.59
cmrkwakjb000u11r9pfhpwgm3	cmrkwakhq000s11r9vssa3reg	2e3a39f5-ce8f-4388-b177-b2e3117af97e	botel glass set	2	444.00	2026-07-14 16:58:17.59
cmrkwakjb000v11r9t9y5bicf	cmrkwakhq000s11r9vssa3reg	3940aa77-8908-43ea-82ba-fe6435df1e20	alchoal cup	1	800.00	2026-07-14 16:58:17.59
cmrlh341n000x11r9uzlokqn5	cmrlh340f000w11r9nd62a3bf	48ca94ea-1174-4511-bc2e-f38eea326bf9	jeck denial bottel lemp	1	1000.00	2026-07-15 02:40:21.563
cmrlh341n000y11r97eaqzpxq	cmrlh340f000w11r9nd62a3bf	2e3a39f5-ce8f-4388-b177-b2e3117af97e	botel glass set	2	444.00	2026-07-15 02:40:21.563
cmrlh341n000z11r9sifb0gnv	cmrlh340f000w11r9nd62a3bf	3940aa77-8908-43ea-82ba-fe6435df1e20	alchoal cup	1	800.00	2026-07-15 02:40:21.563
cmrlhl3ku001111r954wrorps	cmrlhl3jz001011r9w534ybl0	48ca94ea-1174-4511-bc2e-f38eea326bf9	jeck denial bottel lemp	1	1000.00	2026-07-15 02:54:20.766
cmrlhl3ku001211r9ihq5lfvd	cmrlhl3jz001011r9w534ybl0	2e3a39f5-ce8f-4388-b177-b2e3117af97e	botel glass set	2	444.00	2026-07-15 02:54:20.766
cmrlhl3ku001311r9e1i8te6z	cmrlhl3jz001011r9w534ybl0	3940aa77-8908-43ea-82ba-fe6435df1e20	alchoal cup	1	800.00	2026-07-15 02:54:20.766
cmrm1rkd40001u4r943n3evti	cmrm1rkco0000u4r90a4k958q	48ca94ea-1174-4511-bc2e-f38eea326bf9	jeck denial bottel lemp	1	1000.00	2026-07-15 12:19:14.776
cmrm1rkd40002u4r9g956da7f	cmrm1rkco0000u4r90a4k958q	2e3a39f5-ce8f-4388-b177-b2e3117af97e	botel glass set	2	444.00	2026-07-15 12:19:14.776
cmrm1rkd40003u4r9mjeoegrx	cmrm1rkco0000u4r90a4k958q	3940aa77-8908-43ea-82ba-fe6435df1e20	alchoal cup	1	800.00	2026-07-15 12:19:14.776
cmrmywdzq0005u4r9njhhkqiw	cmrmywdxk0004u4r90xu01sei	48ca94ea-1174-4511-bc2e-f38eea326bf9	jeck denial bottel lemp	1	1000.00	2026-07-16 03:46:47.126
cmrmywdzr0006u4r9z2s4u7ah	cmrmywdxk0004u4r90xu01sei	2e3a39f5-ce8f-4388-b177-b2e3117af97e	botel glass set	2	444.00	2026-07-16 03:46:47.126
cmrmywdzr0007u4r9ux6mw049	cmrmywdxk0004u4r90xu01sei	3940aa77-8908-43ea-82ba-fe6435df1e20	alchoal cup	1	800.00	2026-07-16 03:46:47.126
cmrmztr020009u4r9slpg8b0x	cmrmztqwb0008u4r95za769vx	48ca94ea-1174-4511-bc2e-f38eea326bf9	jeck denial bottel lemp	1	1000.00	2026-07-16 04:12:43.634
cmrmztr02000au4r9dxhipvjc	cmrmztqwb0008u4r95za769vx	2e3a39f5-ce8f-4388-b177-b2e3117af97e	botel glass set	2	444.00	2026-07-16 04:12:43.634
cmrmztr02000bu4r9k7wjn0tn	cmrmztqwb0008u4r95za769vx	3940aa77-8908-43ea-82ba-fe6435df1e20	alchoal cup	1	800.00	2026-07-16 04:12:43.634
cmrn1b4ir000du4r9a1vdpaoy	cmrn1b4i5000cu4r9w0etwcn5	48ca94ea-1174-4511-bc2e-f38eea326bf9	jeck denial bottel lemp	1	1000.00	2026-07-16 04:54:13.923
cmrn1b4ir000eu4r9h8uw5wxp	cmrn1b4i5000cu4r9w0etwcn5	2e3a39f5-ce8f-4388-b177-b2e3117af97e	botel glass set	2	444.00	2026-07-16 04:54:13.923
cmrn1b4ir000fu4r9mf0sh99e	cmrn1b4i5000cu4r9w0etwcn5	3940aa77-8908-43ea-82ba-fe6435df1e20	alchoal cup	1	800.00	2026-07-16 04:54:13.923
cmrn22a1m000hu4r977m270yf	cmrn22a1e000gu4r9s42k6rdb	05fcfdf4-5e83-4a84-bb01-e6b12f517aed	snake tray	2	1400.00	2026-07-16 05:15:20.794
cmrn343la000152r9ifoovi8k	cmrn343kz000052r9xqxsw02i	05fcfdf4-5e83-4a84-bb01-e6b12f517aed	snake tray	2	1400.00	2026-07-16 05:44:45.358
cmrn3ng82000352r9bjls722i	cmrn3ng7x000252r97j5k3vhz	48ca94ea-1174-4511-bc2e-f38eea326bf9	jeck denial bottel lemp	1	1000.00	2026-07-16 05:59:48.194
cmrn3ng82000452r9vjeqf589	cmrn3ng7x000252r97j5k3vhz	2e3a39f5-ce8f-4388-b177-b2e3117af97e	botel glass set	2	444.00	2026-07-16 05:59:48.194
cmrn3ng82000552r9x3802wed	cmrn3ng7x000252r97j5k3vhz	3940aa77-8908-43ea-82ba-fe6435df1e20	alchoal cup	1	800.00	2026-07-16 05:59:48.194
cmrp49rlc0001j0r9zm1pfymh	cmrp49rku0000j0r9t01lm76d	48ca94ea-1174-4511-bc2e-f38eea326bf9	jeck denial bottel lemp	1	1000.00	2026-07-17 15:52:41.712
cmrp49rlc0002j0r95lws265u	cmrp49rku0000j0r9t01lm76d	2e3a39f5-ce8f-4388-b177-b2e3117af97e	botel glass set	2	444.00	2026-07-17 15:52:41.712
cmrp49rlc0003j0r9kp0q26vy	cmrp49rku0000j0r9t01lm76d	3940aa77-8908-43ea-82ba-fe6435df1e20	alchoal cup	1	800.00	2026-07-17 15:52:41.712
\.


--
-- Data for Name: CheckoutSession; Type: TABLE DATA; Schema: public; Owner: karan
--

COPY public."CheckoutSession" (id, "userId", status, subtotal, shipping, total, tax, "expiresAt", "createdAt", "updatedAt", "guestId", "addressId") FROM stdin;
cmrmztqwb0008u4r95za769vx	\N	ACTIVE	2688.00	0.00	3171.84	483.84	2026-07-16 04:37:43.49	2026-07-16 04:12:43.499	2026-07-16 04:12:43.499	guest_454ff8cb-9455-43ec-a845-19a881a54463	\N
cmqs8fdms0004qor9cl2koys4	\N	ACTIVE	800.00	100.00	1044.00	144.00	2026-06-24 15:47:38.211	2026-06-24 15:32:38.212	2026-06-24 15:32:38.212	guest_11d42fa2-96ae-4386-b714-f04294266f2c	\N
cmriymwyh000a11r9olv5xw3h	\N	ACTIVE	1000.00	0.00	1180.00	180.00	2026-07-13 08:53:20.44	2026-07-13 08:28:20.441	2026-07-13 08:28:20.441	guest_454ff8cb-9455-43ec-a845-19a881a54463	\N
cmqs70e5f000bkar9z5ibg158	\N	PAYMENT_PENDING	800.00	100.00	1044.00	144.00	2026-06-24 15:07:59.426	2026-06-24 14:52:59.427	2026-06-24 15:07:23.914	guest_11d42fa2-96ae-4386-b714-f04294266f2c	\N
cmqs7p22j0001qor9wi5izskb	\N	PAYMENT_PENDING	800.00	100.00	1044.00	144.00	2026-06-24 15:27:10.17	2026-06-24 15:12:10.171	2026-06-24 15:18:53.521	guest_11d42fa2-96ae-4386-b714-f04294266f2c	\N
cmqs8fdmu0005qor9dywf9gw8	\N	PAYMENT_PENDING	800.00	100.00	1044.00	144.00	2026-06-24 15:47:38.213	2026-06-24 15:32:38.214	2026-06-24 15:43:08.247	guest_11d42fa2-96ae-4386-b714-f04294266f2c	\N
cmrn1b4i5000cu4r9w0etwcn5	\N	ACTIVE	2688.00	0.00	3171.84	483.84	2026-07-16 05:19:13.9	2026-07-16 04:54:13.901	2026-07-16 04:54:13.901	guest_454ff8cb-9455-43ec-a845-19a881a54463	\N
cmqs930dr000186r9kwonxzd1	\N	ACTIVE	800.00	100.00	1044.00	144.00	2026-06-24 16:16:00.782	2026-06-24 15:51:00.783	2026-06-24 15:51:00.783	guest_11d42fa2-96ae-4386-b714-f04294266f2c	\N
cmrn22a1e000gu4r9s42k6rdb	\N	ACTIVE	2800.00	0.00	3304.00	504.00	2026-07-16 05:40:20.784	2026-07-16 05:15:20.786	2026-07-16 05:15:20.786	guest_1e0e0c3d-8363-40e5-a85e-18284e5ea526	\N
cmqs930dp000086r9s513o9h5	\N	PAYMENT_PENDING	800.00	100.00	1044.00	144.00	2026-06-24 16:16:00.766	2026-06-24 15:51:00.781	2026-06-24 16:08:54.475	guest_11d42fa2-96ae-4386-b714-f04294266f2c	\N
cmqs70e4c0009kar97eu7uked	\N	ACTIVE	800.00	100.00	1044.00	144.00	2026-06-24 15:07:59.387	2026-06-24 14:52:59.388	2026-06-24 14:52:59.388	guest_11d42fa2-96ae-4386-b714-f04294266f2c	\N
cmrkujlle000l11r9zdh9mtku	\N	ACTIVE	2688.00	0.00	3171.84	483.84	2026-07-14 16:34:19.633	2026-07-14 16:09:19.634	2026-07-14 16:09:19.634	guest_454ff8cb-9455-43ec-a845-19a881a54463	\N
cmqsa44yt00012yr9ejts105l	\N	PAYMENT_PENDING	800.00	100.00	1044.00	144.00	2026-06-24 16:44:52.997	2026-06-24 16:19:52.997	2026-06-24 16:20:11.912	guest_11d42fa2-96ae-4386-b714-f04294266f2c	\N
cmrn343kz000052r9xqxsw02i	\N	ACTIVE	2800.00	0.00	3304.00	504.00	2026-07-16 06:09:45.34	2026-07-16 05:44:45.347	2026-07-16 05:45:42.13	guest_1e0e0c3d-8363-40e5-a85e-18284e5ea526	5b039e2a-8386-4d2b-84e8-d15703dc5156
cmqs7p22h0000qor9rrnvwn4a	\N	ACTIVE	800.00	100.00	1044.00	144.00	2026-06-24 15:27:10.156	2026-06-24 15:12:10.169	2026-06-24 15:12:10.169	guest_11d42fa2-96ae-4386-b714-f04294266f2c	\N
cmqsa44ys00002yr92n4lf28a	\N	ACTIVE	800.00	100.00	1044.00	144.00	2026-06-24 16:44:52.983	2026-06-24 16:19:52.996	2026-06-24 16:19:52.996	guest_11d42fa2-96ae-4386-b714-f04294266f2c	\N
cmrn3ng7x000252r97j5k3vhz	\N	PAYMENT_PENDING	2688.00	0.00	3171.84	483.84	2026-07-16 06:24:48.186	2026-07-16 05:59:48.189	2026-07-16 06:01:21.974	guest_454ff8cb-9455-43ec-a845-19a881a54463	db616ba5-1f00-4987-9d39-f231c409bf62
cmrc9aoxw0005ztr9pg3si9ei	\N	ACTIVE	1888.00	0.00	2227.84	339.84	2026-07-08 16:17:22.724	2026-07-08 15:52:22.724	2026-07-08 15:52:22.724	guest_454ff8cb-9455-43ec-a845-19a881a54463	\N
cmrc9aoxv0004ztr92c7hy7uq	\N	ACTIVE	1888.00	0.00	2227.84	339.84	2026-07-08 16:17:22.705	2026-07-08 15:52:22.723	2026-07-08 15:52:22.723	guest_454ff8cb-9455-43ec-a845-19a881a54463	\N
cmrf7n34c0000bgr984qfep2u	\N	EXPIRED	1400.00	0.00	1652.00	252.00	2026-07-10 17:54:20.263	2026-07-10 17:29:20.268	2026-07-11 04:08:08.434	guest_1e0e0c3d-8363-40e5-a85e-18284e5ea526	\N
cmrp49rku0000j0r9t01lm76d	\N	ACTIVE	2688.00	0.00	3171.84	483.84	2026-07-17 16:17:41.674	2026-07-17 15:52:41.694	2026-07-17 15:52:41.694	guest_454ff8cb-9455-43ec-a845-19a881a54463	\N
cmrfvct0f000011r9ndoru3ej	\N	ACTIVE	1000.00	0.00	1180.00	180.00	2026-07-11 04:58:11.387	2026-07-11 04:33:11.391	2026-07-11 04:33:11.391	guest_454ff8cb-9455-43ec-a845-19a881a54463	\N
cmrfvct1q000211r9li2qv36b	\N	ACTIVE	1000.00	0.00	1180.00	180.00	2026-07-11 04:58:11.438	2026-07-11 04:33:11.438	2026-07-11 04:33:11.438	guest_454ff8cb-9455-43ec-a845-19a881a54463	\N
cmrg1rdiz000411r92212l17e	\N	ACTIVE	1000.00	0.00	1180.00	180.00	2026-07-11 07:57:28.856	2026-07-11 07:32:28.859	2026-07-11 07:32:28.859	guest_454ff8cb-9455-43ec-a845-19a881a54463	\N
cmrg5meob000611r916mewqos	\N	ACTIVE	1000.00	0.00	1180.00	180.00	2026-07-11 09:45:35.525	2026-07-11 09:20:35.531	2026-07-11 09:20:35.531	guest_454ff8cb-9455-43ec-a845-19a881a54463	\N
cmrgc0rn5000811r9x1c2617h	\N	ACTIVE	1000.00	0.00	1180.00	180.00	2026-07-11 12:44:43.214	2026-07-11 12:19:43.217	2026-07-11 12:19:43.217	guest_454ff8cb-9455-43ec-a845-19a881a54463	\N
cmrfugybl00009yr92bp4n9bv	\N	ACTIVE	1400.00	0.00	1652.00	252.00	2026-07-11 04:33:25.273	2026-07-11 04:08:25.281	2026-07-11 04:22:02.19	guest_1e0e0c3d-8363-40e5-a85e-18284e5ea526	\N
cmrizywgx000c11r9ile7sq8n	\N	EXPIRED	1000.00	0.00	1180.00	180.00	2026-07-13 09:30:39.292	2026-07-13 09:05:39.297	2026-07-13 09:41:19.199	guest_454ff8cb-9455-43ec-a845-19a881a54463	\N
cmrj4ld5r000g11r9f4n80mwk	\N	EXPIRED	2688.00	0.00	3171.84	483.84	2026-07-13 11:40:05.81	2026-07-13 11:15:05.823	2026-07-14 11:10:48.748	guest_454ff8cb-9455-43ec-a845-19a881a54463	\N
cmrkujllc000k11r9cngsjsv0	\N	PAYMENT_PENDING	2688.00	0.00	3171.84	483.84	2026-07-14 16:34:19.63	2026-07-14 16:09:19.632	2026-07-14 16:09:52.709	guest_454ff8cb-9455-43ec-a845-19a881a54463	\N
cmrkwakhq000s11r9vssa3reg	\N	PAYMENT_PENDING	2688.00	0.00	3171.84	483.84	2026-07-14 17:23:17.531	2026-07-14 16:58:17.534	2026-07-14 16:58:46.695	guest_454ff8cb-9455-43ec-a845-19a881a54463	\N
cmrlh340f000w11r9nd62a3bf	\N	PAYMENT_PENDING	2688.00	0.00	3171.84	483.84	2026-07-15 03:05:21.515	2026-07-15 02:40:21.519	2026-07-15 02:45:51.596	guest_454ff8cb-9455-43ec-a845-19a881a54463	\N
cmrlhl3jz001011r9w534ybl0	\N	EXPIRED	2688.00	0.00	3171.84	483.84	2026-07-15 03:19:20.734	2026-07-15 02:54:20.735	2026-07-15 12:19:03.517	guest_454ff8cb-9455-43ec-a845-19a881a54463	\N
cmrm1rkco0000u4r90a4k958q	\N	ACTIVE	2688.00	0.00	3171.84	483.84	2026-07-15 12:44:14.755	2026-07-15 12:19:14.761	2026-07-15 12:19:14.761	guest_454ff8cb-9455-43ec-a845-19a881a54463	\N
cmrmywdxk0004u4r90xu01sei	\N	ACTIVE	2688.00	0.00	3171.84	483.84	2026-07-16 04:11:47.046	2026-07-16 03:46:47.048	2026-07-16 03:46:47.048	guest_454ff8cb-9455-43ec-a845-19a881a54463	\N
\.


--
-- Data for Name: EmailOTP; Type: TABLE DATA; Schema: public; Owner: karan
--

COPY public."EmailOTP" (id, email, "otpHash", purpose, "expiresAt", attempts, "maxAttempts", "createdAt", metadata, "varifiedAt", verified) FROM stdin;
\.


--
-- Data for Name: Order; Type: TABLE DATA; Schema: public; Owner: karan
--

COPY public."Order" (id, "orderNumber", "userId", "guestId", "customerName", "customerEmail", "customerPhone", "addressId", status, "paymentStatus", subtotal, tax, shipping, discount, total, "createdAt", "updatedAt", "addressSnapshot") FROM stdin;
3e814e70-53c5-4600-ac29-900a1687c950	ORD-20260716-000030	\N	\N	sfsfds 	\N	9999999999	db616ba5-1f00-4987-9d39-f231c409bf62	CONFIRMED	PAID	2688.00	483.84	0.00	0.00	3171.84	2026-07-16 06:01:21.511	2026-07-16 06:01:51.965	{"city": "SDH Moonak", "phone": "9999999999", "state": "Punjab", "country": "India", "fullName": "sfsfds ", "latitude": null, "longitude": null, "postalCode": "148033", "addressLine1": "asfaf asfdaf af"}
\.


--
-- Data for Name: OrderCounter; Type: TABLE DATA; Schema: public; Owner: karan
--

COPY public."OrderCounter" (id, value) FROM stdin;
1	30
\.


--
-- Data for Name: OrderItem; Type: TABLE DATA; Schema: public; Owner: karan
--

COPY public."OrderItem" (id, "orderId", "productId", "productName", quantity, "unitPrice", "totalPrice", "createdAt") FROM stdin;
af7784d5-2c5f-4d6e-a315-6ca1af68b30e	3e814e70-53c5-4600-ac29-900a1687c950	48ca94ea-1174-4511-bc2e-f38eea326bf9	jeck denial bottel lemp	1	1000.00	1000.00	2026-07-16 06:01:21.522
798ff98e-30ec-4386-b3f7-e75e1c575227	3e814e70-53c5-4600-ac29-900a1687c950	2e3a39f5-ce8f-4388-b177-b2e3117af97e	botel glass set	2	444.00	888.00	2026-07-16 06:01:21.522
c4ae695d-b8b8-45eb-b08c-13152fa1968d	3e814e70-53c5-4600-ac29-900a1687c950	3940aa77-8908-43ea-82ba-fe6435df1e20	alchoal cup	1	800.00	800.00	2026-07-16 06:01:21.522
\.


--
-- Data for Name: Payment; Type: TABLE DATA; Schema: public; Owner: karan
--

COPY public."Payment" (id, "orderId", gateway, "razorpayOrderId", "razorpayPaymentId", "razorpaySignature", amount, status, "createdAt", "updatedAt") FROM stdin;
c2d83628-dc2b-41e3-a936-ab49adada569	3e814e70-53c5-4600-ac29-900a1687c950	RAZORPAY	order_TE4GGkTKu9kvdI	pay_TE4GUqSPKZm7xX	f56efe97c9162f3a6a51ca4638ea9c3d65db38ac66d81872a9175b446d132d02	3171.84	SUCCESS	2026-07-16 06:01:21.967	2026-07-16 06:01:51.962
\.


--
-- Data for Name: Product; Type: TABLE DATA; Schema: public; Owner: karan
--

COPY public."Product" (id, name, description, price, category, stock, "imageUrl", "createdAt", "updatedAt", "oldPrice", slug, tag, status) FROM stdin;
3ca874da-55ce-4b0f-bc22-be096b676705	Bottle Craft	Handmade decor item	499.00	Decor	10	https://example.com/img.jpg	2026-04-27 09:50:20.227	2026-04-30 13:18:04.914	\N	bottle-craft	\N	ACTIVE
7c386f5a-6c0e-4478-b213-ff8e12484903	Bottle Craft	Handmade item	499.00	Decor	10	https://example.com/img.jpg	2026-04-28 10:46:14.427	2026-04-30 13:18:04.919	\N	bottle-craft-1	\N	ACTIVE
edfe6db1-41c6-46ac-961a-ed19a984e522	Bottle Craft	Handmade item	499.00	Decor	10	https://example.com/img.jpg	2026-04-29 10:50:11.244	2026-04-30 13:18:04.924	\N	bottle-craft-2	\N	ACTIVE
bb4c8a67-2e16-48be-a67b-b225ff0d4b03	bottel glass	no mare 	1400.00	\N	10	\N	2026-04-30 11:58:49.867	2026-04-30 13:18:04.926	\N	bottel-glass	\N	ACTIVE
e7d23d89-9f7c-45f1-844f-8fdc560ce843	bottel glass 2	no mare 	1400.00	\N	10	\N	2026-04-30 12:00:07.229	2026-04-30 13:18:04.928	\N	bottel-glass-2	\N	ACTIVE
f5884fcc-ad7d-4724-b2f3-073b34fe2fc1	bottel glass 3	no mare 	1400.00	\N	10	\N	2026-04-30 12:00:35.787	2026-04-30 13:18:04.93	\N	bottel-glass-3	\N	ACTIVE
d32a37e4-08aa-4b48-a135-e7e0feb4c59f	bottel glass 3	no mare 	1400.00	\N	10	\N	2026-04-30 12:14:21.411	2026-04-30 13:18:04.933	\N	bottel-glass-3-1	\N	ACTIVE
ad9c26ea-6f05-42ea-8abc-7a2d199ffeea	bottel glass 3	no mare 	1400.00	\N	10	\N	2026-04-30 12:18:57.559	2026-04-30 13:18:04.939	\N	bottel-glass-3-2	\N	ACTIVE
760875c6-38c8-48a8-bcad-0212ca618049	snake tray	no mare 	1400.00	\N	10	\N	2026-04-30 13:39:18.524	2026-04-30 13:39:18.524	\N	snake-tray	\N	ACTIVE
863c73a1-b9bf-442d-9225-9a130996b546	snake tray	no mare 	1400.00	\N	10	\N	2026-05-01 10:50:03.02	2026-05-01 10:50:03.02	\N	snake-tray-1777632599608	\N	ACTIVE
	glass	any	100.00	decore	100	\N	2026-04-27 09:34:26.679	2026-04-30 13:18:04.907	\N	glass	\N	ACTIVE
48ca94ea-1174-4511-bc2e-f38eea326bf9	jeck denial bottel lemp	Unique bedside lamp crafted from an authentic Jack Daniel's bottle. A distinctive piece for your home decor.	1000.00	decore	8	\N	2026-05-02 13:32:17.26	2026-07-16 06:01:51.966	2000.00	jeck-denial-bottel-lemp	\N	ACTIVE
2e3a39f5-ce8f-4388-b177-b2e3117af97e	botel glass set	dgdfgdfgdg	444.00	decore	15	\N	2026-05-02 11:11:30.592	2026-07-16 06:01:51.968	\N	botel-glass-set	\N	ACTIVE
3940aa77-8908-43ea-82ba-fe6435df1e20	alchoal cup	Sip your wine in style with this unique cup, expertly crafted from a recycled Corona beer bottle. A perfect eco-friendly gift.	800.00	\N	5	\N	2026-05-02 13:25:48.977	2026-07-16 06:01:51.969	\N	alchoal-cup	\N	ACTIVE
05fcfdf4-5e83-4a84-bb01-e6b12f517aed	snake tray	no mare 	1400.00	decore	10	\N	2026-05-01 10:49:46.886	2026-05-01 10:49:46.886	\N	snake-tray-1777632581360	\N	ACTIVE
172ce8ec-5e49-4aa7-8ead-3730f4f84318	snake tray	no mare 	1400.00	decore	10	\N	2026-05-02 10:41:32.435	2026-05-02 10:41:32.435	\N	snake-tray-1777718488644	newproduct	ACTIVE
\.


--
-- Data for Name: ProductImage; Type: TABLE DATA; Schema: public; Owner: karan
--

COPY public."ProductImage" (id, url, "publicId", "productId", "createdAt") FROM stdin;
cmolfkkk100009cr9ebnmhaz0	https://res.cloudinary.com/dug5p4xso/image/upload/v1777550329/ecocraft/products/aoaqethkmgnn4i4zuqlq.jpg	ecocraft/products/aoaqethkmgnn4i4zuqlq	bb4c8a67-2e16-48be-a67b-b225ff0d4b03	2026-04-30 11:58:49.867
cmolfm88z00019cr9hi3srbkt	https://res.cloudinary.com/dug5p4xso/image/upload/v1777550405/ecocraft/products/tb8oimflsjzp6td9mjup.jpg	ecocraft/products/tb8oimflsjzp6td9mjup	e7d23d89-9f7c-45f1-844f-8fdc560ce843	2026-04-30 12:00:07.229
cmolfm88z00029cr94pcc5g28	https://res.cloudinary.com/dug5p4xso/image/upload/v1777550405/ecocraft/products/elwoibew5ewr0xsz281d.jpg	ecocraft/products/elwoibew5ewr0xsz281d	e7d23d89-9f7c-45f1-844f-8fdc560ce843	2026-04-30 12:00:07.229
cmolfmua800039cr9j0mitx0b	https://res.cloudinary.com/dug5p4xso/image/upload/v1777550434/ecocraft/products/qbeohuyrdaacu7x6qwwm.jpg	ecocraft/products/qbeohuyrdaacu7x6qwwm	f5884fcc-ad7d-4724-b2f3-073b34fe2fc1	2026-04-30 12:00:35.787
cmolfmua800049cr9wvunjjq0	https://res.cloudinary.com/dug5p4xso/image/upload/v1777550435/ecocraft/products/yxmzg0dbndhlyvxoeruc.jpg	ecocraft/products/yxmzg0dbndhlyvxoeruc	f5884fcc-ad7d-4724-b2f3-073b34fe2fc1	2026-04-30 12:00:35.787
cmolg4jc800003ir9lafu3tj8	https://res.cloudinary.com/dug5p4xso/image/upload/v1777551259/ecocraft/products/dbf4wsa1ybrsia2j8hit.jpg	ecocraft/products/dbf4wsa1ybrsia2j8hit	d32a37e4-08aa-4b48-a135-e7e0feb4c59f	2026-04-30 12:14:21.411
cmolg4jc800013ir9hdhxzgd7	https://res.cloudinary.com/dug5p4xso/image/upload/v1777551260/ecocraft/products/iavtlhg7oduc3xwahkoq.jpg	ecocraft/products/iavtlhg7oduc3xwahkoq	d32a37e4-08aa-4b48-a135-e7e0feb4c59f	2026-04-30 12:14:21.411
cmolgagf30000zgr9w9kdlpku	https://res.cloudinary.com/dug5p4xso/image/upload/v1777551535/ecocraft/products/lrlbnkbxbcu6b8m8ygbm.jpg	ecocraft/products/lrlbnkbxbcu6b8m8ygbm	ad9c26ea-6f05-42ea-8abc-7a2d199ffeea	2026-04-30 12:18:57.559
cmolgagf30001zgr99crx1c15	https://res.cloudinary.com/dug5p4xso/image/upload/v1777551536/ecocraft/products/m9levpgrcgx9shcf1sqg.jpg	ecocraft/products/m9levpgrcgx9shcf1sqg	ad9c26ea-6f05-42ea-8abc-7a2d199ffeea	2026-04-30 12:18:57.559
cmolj5sat0000m1r9b6s8u3oa	https://res.cloudinary.com/dug5p4xso/image/upload/v1777556357/ecocraft/products/g5bfvuvv70fd6qj4da3n.jpg	ecocraft/products/g5bfvuvv70fd6qj4da3n	760875c6-38c8-48a8-bcad-0212ca618049	2026-04-30 13:39:18.524
cmolj5sat0001m1r9jchvwn5k	https://res.cloudinary.com/dug5p4xso/image/upload/v1777556357/ecocraft/products/p8tp9i1dskfz01dvofcs.jpg	ecocraft/products/p8tp9i1dskfz01dvofcs	760875c6-38c8-48a8-bcad-0212ca618049	2026-04-30 13:39:18.524
cmomsjmhf000085r9gjysgl0f	https://res.cloudinary.com/dug5p4xso/image/upload/v1777632585/ecocraft/products/cqqu7jfsqnfwgxkipbww.jpg	ecocraft/products/cqqu7jfsqnfwgxkipbww	05fcfdf4-5e83-4a84-bb01-e6b12f517aed	2026-05-01 10:49:46.886
cmomsjmhf000185r9l6euvhb2	https://res.cloudinary.com/dug5p4xso/image/upload/v1777632586/ecocraft/products/plxtmxahwzwitflqmsip.jpg	ecocraft/products/plxtmxahwzwitflqmsip	05fcfdf4-5e83-4a84-bb01-e6b12f517aed	2026-05-01 10:49:46.886
cmomsjyxc000285r9585ojbxc	https://res.cloudinary.com/dug5p4xso/image/upload/v1777632601/ecocraft/products/yr0kzev4ukgp4mugxlwn.jpg	ecocraft/products/yr0kzev4ukgp4mugxlwn	863c73a1-b9bf-442d-9225-9a130996b546	2026-05-01 10:50:03.02
cmomsjyxc000385r9jf66jdmc	https://res.cloudinary.com/dug5p4xso/image/upload/v1777632602/ecocraft/products/gxvzpbp5btiydwqhaogp.jpg	ecocraft/products/gxvzpbp5btiydwqhaogp	863c73a1-b9bf-442d-9225-9a130996b546	2026-05-01 10:50:03.02
cmoo7ovmp0000lfr9guk3z73q	https://res.cloudinary.com/dug5p4xso/image/upload/v1777718491/ecocraft/products/v2lfwkaestmaxyzyptt7.jpg	ecocraft/products/v2lfwkaestmaxyzyptt7	172ce8ec-5e49-4aa7-8ead-3730f4f84318	2026-05-02 10:41:32.435
cmoo7ovmp0001lfr9vt5vpvhr	https://res.cloudinary.com/dug5p4xso/image/upload/v1777718491/ecocraft/products/zwef9a5hnzddpkuvcscw.jpg	ecocraft/products/zwef9a5hnzddpkuvcscw	172ce8ec-5e49-4aa7-8ead-3730f4f84318	2026-05-02 10:41:32.435
cmoo8rf3k0002lfr9dfh5bibo	https://res.cloudinary.com/dug5p4xso/image/upload/v1777720289/ecocraft/products/wmuddor6wjvdxw2233zo.jpg	ecocraft/products/wmuddor6wjvdxw2233zo	2e3a39f5-ce8f-4388-b177-b2e3117af97e	2026-05-02 11:11:30.592
cmoodk4zh0000dzr9qorlj3td	https://res.cloudinary.com/dug5p4xso/image/upload/v1777728347/ecocraft/products/jejjw3gdjrqjkiu63mal.jpg	ecocraft/products/jejjw3gdjrqjkiu63mal	3940aa77-8908-43ea-82ba-fe6435df1e20	2026-05-02 13:25:48.977
cmoodsgkw0001dzr9fvurqyb3	https://res.cloudinary.com/dug5p4xso/image/upload/v1777728736/ecocraft/products/bfxg35wu5eyg694z5scj.jpg	ecocraft/products/bfxg35wu5eyg694z5scj	48ca94ea-1174-4511-bc2e-f38eea326bf9	2026-05-02 13:32:17.26
\.


--
-- Data for Name: User; Type: TABLE DATA; Schema: public; Owner: karan
--

COPY public."User" (id, email, name, "emailVerified", "createdAt", "updatedAt", role, password, phone) FROM stdin;
f9175847-ccc1-4ae1-a3e9-bbe67eb73ced	karanramghria58@gmail.com	karan	f	2026-06-07 12:27:49.259	2026-06-07 12:27:49.259	USER	$2b$10$VK2wXcLVylrOWXOm.UQhvOI2xgBp.7bZc0c5yL3C1CP2wTIGpUS.W	\N
\.


--
-- Data for Name: _prisma_migrations; Type: TABLE DATA; Schema: public; Owner: karan
--

COPY public._prisma_migrations (id, checksum, finished_at, migration_name, logs, rolled_back_at, started_at, applied_steps_count) FROM stdin;
3c35d246-9ea2-4191-8840-a72b6deb3fc2	ca48c90e1b3765b0eea398fa3fb3767fad7fcc25bbb27a65b6fe077de24699af	2026-04-27 09:26:03.040264+00	20260427092603_create_products	\N	\N	2026-04-27 09:26:03.035167+00	1
7f381fbb-9aa6-4dcb-9a23-ba24b0de0b34	d7cc542b23e0c678201296846589b6b301992a4c716ef6d7afefc8894d125b7e	2026-06-05 11:58:16.384596+00	20260605115816_add_guest_id_in_checkoutsession	\N	\N	2026-06-05 11:58:16.380819+00	1
56a3008d-e6ee-4d91-8a4e-88eb1c787724	f03b377a31ef2578a82c614417cb6ae9b3f54f3163ad0578f22c3ee465469d51	2026-04-28 13:00:31.265595+00	20260428130031_add_old_price	\N	\N	2026-04-28 13:00:31.262689+00	1
fae4da8a-6b59-487d-afd4-f27ad10c1607	df61f914173f68d0398c225ede9149928f8eb7486f7895abfe2b3959a0ed9919	2026-04-30 11:17:14.834522+00	20260430111714_add_product_images	\N	\N	2026-04-30 11:17:14.815913+00	1
841a0197-c4fc-417c-a995-86c2392c6a21	1dcd734b53c3659f5a85bbf2d2424e4e37cdc6f089066e7c3375f92e6795c1a9	2026-06-21 12:35:46.975399+00	20260621123546_add_address_snapshot	\N	\N	2026-06-21 12:35:46.971783+00	1
c2665d3b-0dd6-4db5-a61b-5cfbf54f1eb4	4255f39d37badbe3249a9ea684a59fef3c64adff69e573e243941a496599f86f	2026-04-30 13:08:56.470793+00	20260430130856_add_slug_optional	\N	\N	2026-04-30 13:08:56.453294+00	1
8bd0d707-e3aa-46e7-8e70-5f5b717c71d5	0d5b743443dcf0f5d57dbdfb8b4d7b8aacea9c70ffc4d9f5f3a747bd6dbe8901	2026-06-07 08:11:21.463114+00	20260607081121_add_payment_order_item_address_and_order_table	\N	\N	2026-06-07 08:11:21.437469+00	1
133fc8d5-991b-406e-8765-fe1534477528	4c47596ea398d97ac428ea271db83b41db4379ab2e3e17c3d94b65e8e93bdbac	2026-04-30 13:19:11.290694+00	20260430131911_make_slug_required	\N	\N	2026-04-30 13:19:11.28693+00	1
1708f46d-fb97-4397-9170-d46936826cb7	150002aa5ad45324d265f15c506600ddce0e947179e2388a045564a9d5fdb904	2026-05-02 09:48:49.992008+00	20260502094849_tags	\N	\N	2026-05-02 09:48:49.988096+00	1
9ef30509-be4d-4edc-8d9c-ccf5472be2b4	ce252c22d7935928de52027e5ee6fdf02c2ae047ee2ad4196c4bb6b832e7913f	2026-05-04 04:53:21.232884+00	20260504045321_create_user_table	\N	\N	2026-05-04 04:53:21.216672+00	1
51aa7905-853a-42e4-8b7d-1ffd6ad497a4	b66ec46c3eb317dcd131c9f62b22245c248b79a01d00f69cfee608ab9f27e6c9	2026-06-07 09:08:07.939646+00	20260607090807_add_phone_number_in_user	\N	\N	2026-06-07 09:08:07.924682+00	1
8d4cbe39-bdde-4965-950c-9b68fcf3ae32	3e26514893b6f3c00b57e8c8dbbe3bad32c28586792a35e4038713cd33f68a7f	2026-05-04 06:39:50.619011+00	20260504063950_add_role_in_user	\N	\N	2026-05-04 06:39:50.614004+00	1
d04300cf-41f9-424e-aaac-ea3099d39e09	7a60a21a706fa8679f6086a6a8887531f60fe1712be9365e670c0c39cc129a8f	2026-05-04 07:08:55.398384+00	20260504070855_change_password_spelling	\N	\N	2026-05-04 07:08:55.394017+00	1
14c5a5a8-e137-448a-a67a-968674e4d43e	097279a749e44042fe2a5f4ceeae05d38a3fee6f105e79cb181c046cddcc9d8d	2026-07-15 03:35:09.693346+00	20260715033509_add_new_enum_in_emai	\N	\N	2026-07-15 03:35:09.657455+00	1
107c9c92-b26e-4f29-aac6-4fed4ce8e14d	36afdb213351228e9bbe884bc8e37da1add6106d48fe12e2e3971d5e345aa6f3	2026-05-04 08:46:55.213784+00	20260504084655_add_otp_table	\N	\N	2026-05-04 08:46:55.19897+00	1
0661a216-9333-4cc8-aebc-cde2fb680c0c	5fde3866df276990e33cfcc86ab5b406adfea6bd82088d0eeed57de01fc3b1bf	2026-06-07 10:57:32.942824+00	20260607105732_change_otp_table	\N	\N	2026-06-07 10:57:32.937705+00	1
a2c43bbf-dc5e-41f0-b60e-3b1c1b7003e9	17ed4fa420e9186f532d56b9102a5154183418ed107f12b648d7fa42011a4e4e	2026-05-08 12:00:57.025792+00	20260508120056_add_cart_and_cart_items	\N	\N	2026-05-08 12:00:56.994821+00	1
e443f858-3dbb-4209-bea3-1e1025f3a78f	d5e8891f8cfac561aed3fc6dadc3979abb972a514e380dd166571e623e9f82ae	2026-05-08 12:50:31.220404+00	20260508125031_update_cart_schema_for_guest_user	\N	\N	2026-05-08 12:50:31.185133+00	1
f3aa2378-bfa8-4477-9e9e-a830d2ca84f0	063ba411c31868ff9ac0869476bfdb039a6e1ff945c1ba019e64ff114905d3b8	2026-06-22 08:46:00.189007+00	20260622084600_make_optional_customer_email_in_order_table	\N	\N	2026-06-22 08:46:00.159599+00	1
05154de4-50a1-4701-b353-ac24d9e4ec16	3ef8e5983d90d0dd8ad2ba205ddc839554ac6fbc0e92a585b80a091002a39a00	2026-06-05 07:25:07.136951+00	20260605072507_add_checkout_session	\N	\N	2026-06-05 07:25:07.123644+00	1
38996254-69a8-4222-b881-4140f3b93d1f	07731ce62c9e1187570016567198bb4d95121aaa1c9e0838fd2673fd728fbce4	2026-06-08 10:43:43.438721+00	20260608104343_change_address_system	\N	\N	2026-06-08 10:43:43.410916+00	1
03aa6087-e98a-45ad-af37-d0c0e32c29a9	0c7ce390bac4c96b59eec51ddcfaf483fc54604d659f56e9f7e2b856f700ab8a	2026-06-08 11:21:11.841795+00	20260608112111_add_guest_id_in_address_table	\N	\N	2026-06-08 11:21:11.837824+00	1
e4177c0f-4d2b-4505-a923-1d1773045659	7d6ed2d614f80d18555363cb660d07b295f700b9830ddc16fdbfac8e96408484	2026-06-20 09:35:11.919953+00	20260620093511_add_landmark	\N	\N	2026-06-20 09:35:11.909302+00	1
da2be3a6-91c9-464a-a25b-07308aeac444	41575f719b185e7c6aca5e9ff4fecfc612bba0ce4828311aba3b9b48bc09fbb0	2026-06-22 08:51:39.903747+00	20260622085139_add_order_counter_for_order_number	\N	\N	2026-06-22 08:51:39.889297+00	1
26bd7d7e-c084-40f7-86cb-de80d63a77a2	add45a336402ae6b2694f59692a5a5b11740365a480b0074ede310b9fe8a29c9	2026-06-21 12:10:26.123314+00	20260621121026_add_relation_between_user_and_checkoutsession	\N	\N	2026-06-21 12:10:26.102581+00	1
8886f2ee-90fe-4a78-aacd-b4ccc75e5c0f	727e3dd3e2ecda76bcc8c5ac61626c650de23e66ea5dd44438cf0f22b2492350	2026-07-10 12:11:53.272069+00	20260710121153_change_product_featured_to_status	\N	\N	2026-07-10 12:11:53.253404+00	1
a83d8e50-9fc5-4986-b2b6-07a895c4fa9c	be45b76a7aa33d6ae31b68d0e8b34d7e4b7d326ac0784db50c112b994eee7fc1	2026-07-15 11:41:02.028423+00	20260715114102	\N	\N	2026-07-15 11:41:02.020924+00	1
7ce7cecc-1635-4752-96f4-35f504628df7	59e75b2aef0b2c67d29ee3bb6cdfb0ee38d6d130f0b9ee735c94a12ab11a5628	2026-07-15 03:04:37.82187+00	20260715030437_add_email_in_address_table	\N	\N	2026-07-15 03:04:37.812871+00	1
\.


--
-- Name: Address Address_pkey; Type: CONSTRAINT; Schema: public; Owner: karan
--

ALTER TABLE ONLY public."Address"
    ADD CONSTRAINT "Address_pkey" PRIMARY KEY (id);


--
-- Name: CartItem CartItem_pkey; Type: CONSTRAINT; Schema: public; Owner: karan
--

ALTER TABLE ONLY public."CartItem"
    ADD CONSTRAINT "CartItem_pkey" PRIMARY KEY (id);


--
-- Name: Cart Cart_pkey; Type: CONSTRAINT; Schema: public; Owner: karan
--

ALTER TABLE ONLY public."Cart"
    ADD CONSTRAINT "Cart_pkey" PRIMARY KEY (id);


--
-- Name: CheckoutItem CheckoutItem_pkey; Type: CONSTRAINT; Schema: public; Owner: karan
--

ALTER TABLE ONLY public."CheckoutItem"
    ADD CONSTRAINT "CheckoutItem_pkey" PRIMARY KEY (id);


--
-- Name: CheckoutSession CheckoutSession_pkey; Type: CONSTRAINT; Schema: public; Owner: karan
--

ALTER TABLE ONLY public."CheckoutSession"
    ADD CONSTRAINT "CheckoutSession_pkey" PRIMARY KEY (id);


--
-- Name: EmailOTP EmailOTP_pkey; Type: CONSTRAINT; Schema: public; Owner: karan
--

ALTER TABLE ONLY public."EmailOTP"
    ADD CONSTRAINT "EmailOTP_pkey" PRIMARY KEY (id);


--
-- Name: OrderCounter OrderCounter_pkey; Type: CONSTRAINT; Schema: public; Owner: karan
--

ALTER TABLE ONLY public."OrderCounter"
    ADD CONSTRAINT "OrderCounter_pkey" PRIMARY KEY (id);


--
-- Name: OrderItem OrderItem_pkey; Type: CONSTRAINT; Schema: public; Owner: karan
--

ALTER TABLE ONLY public."OrderItem"
    ADD CONSTRAINT "OrderItem_pkey" PRIMARY KEY (id);


--
-- Name: Order Order_pkey; Type: CONSTRAINT; Schema: public; Owner: karan
--

ALTER TABLE ONLY public."Order"
    ADD CONSTRAINT "Order_pkey" PRIMARY KEY (id);


--
-- Name: Payment Payment_pkey; Type: CONSTRAINT; Schema: public; Owner: karan
--

ALTER TABLE ONLY public."Payment"
    ADD CONSTRAINT "Payment_pkey" PRIMARY KEY (id);


--
-- Name: ProductImage ProductImage_pkey; Type: CONSTRAINT; Schema: public; Owner: karan
--

ALTER TABLE ONLY public."ProductImage"
    ADD CONSTRAINT "ProductImage_pkey" PRIMARY KEY (id);


--
-- Name: Product Product_pkey; Type: CONSTRAINT; Schema: public; Owner: karan
--

ALTER TABLE ONLY public."Product"
    ADD CONSTRAINT "Product_pkey" PRIMARY KEY (id);


--
-- Name: User User_pkey; Type: CONSTRAINT; Schema: public; Owner: karan
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_pkey" PRIMARY KEY (id);


--
-- Name: _prisma_migrations _prisma_migrations_pkey; Type: CONSTRAINT; Schema: public; Owner: karan
--

ALTER TABLE ONLY public._prisma_migrations
    ADD CONSTRAINT _prisma_migrations_pkey PRIMARY KEY (id);


--
-- Name: CartItem_cartId_productId_key; Type: INDEX; Schema: public; Owner: karan
--

CREATE UNIQUE INDEX "CartItem_cartId_productId_key" ON public."CartItem" USING btree ("cartId", "productId");


--
-- Name: Cart_guestId_key; Type: INDEX; Schema: public; Owner: karan
--

CREATE UNIQUE INDEX "Cart_guestId_key" ON public."Cart" USING btree ("guestId");


--
-- Name: Cart_userId_key; Type: INDEX; Schema: public; Owner: karan
--

CREATE UNIQUE INDEX "Cart_userId_key" ON public."Cart" USING btree ("userId");


--
-- Name: CheckoutItem_checkoutSessionId_idx; Type: INDEX; Schema: public; Owner: karan
--

CREATE INDEX "CheckoutItem_checkoutSessionId_idx" ON public."CheckoutItem" USING btree ("checkoutSessionId");


--
-- Name: CheckoutSession_userId_idx; Type: INDEX; Schema: public; Owner: karan
--

CREATE INDEX "CheckoutSession_userId_idx" ON public."CheckoutSession" USING btree ("userId");


--
-- Name: EmailOTP_email_idx; Type: INDEX; Schema: public; Owner: karan
--

CREATE INDEX "EmailOTP_email_idx" ON public."EmailOTP" USING btree (email);


--
-- Name: EmailOTP_email_purpose_idx; Type: INDEX; Schema: public; Owner: karan
--

CREATE INDEX "EmailOTP_email_purpose_idx" ON public."EmailOTP" USING btree (email, purpose);


--
-- Name: Order_guestId_idx; Type: INDEX; Schema: public; Owner: karan
--

CREATE INDEX "Order_guestId_idx" ON public."Order" USING btree ("guestId");


--
-- Name: Order_orderNumber_key; Type: INDEX; Schema: public; Owner: karan
--

CREATE UNIQUE INDEX "Order_orderNumber_key" ON public."Order" USING btree ("orderNumber");


--
-- Name: Payment_orderId_key; Type: INDEX; Schema: public; Owner: karan
--

CREATE UNIQUE INDEX "Payment_orderId_key" ON public."Payment" USING btree ("orderId");


--
-- Name: Payment_razorpayOrderId_key; Type: INDEX; Schema: public; Owner: karan
--

CREATE UNIQUE INDEX "Payment_razorpayOrderId_key" ON public."Payment" USING btree ("razorpayOrderId");


--
-- Name: Payment_razorpayPaymentId_key; Type: INDEX; Schema: public; Owner: karan
--

CREATE UNIQUE INDEX "Payment_razorpayPaymentId_key" ON public."Payment" USING btree ("razorpayPaymentId");


--
-- Name: Product_slug_key; Type: INDEX; Schema: public; Owner: karan
--

CREATE UNIQUE INDEX "Product_slug_key" ON public."Product" USING btree (slug);


--
-- Name: User_email_key; Type: INDEX; Schema: public; Owner: karan
--

CREATE UNIQUE INDEX "User_email_key" ON public."User" USING btree (email);


--
-- Name: User_phone_key; Type: INDEX; Schema: public; Owner: karan
--

CREATE UNIQUE INDEX "User_phone_key" ON public."User" USING btree (phone);


--
-- Name: Address Address_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: karan
--

ALTER TABLE ONLY public."Address"
    ADD CONSTRAINT "Address_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: CartItem CartItem_cartId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: karan
--

ALTER TABLE ONLY public."CartItem"
    ADD CONSTRAINT "CartItem_cartId_fkey" FOREIGN KEY ("cartId") REFERENCES public."Cart"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: CartItem CartItem_productId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: karan
--

ALTER TABLE ONLY public."CartItem"
    ADD CONSTRAINT "CartItem_productId_fkey" FOREIGN KEY ("productId") REFERENCES public."Product"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Cart Cart_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: karan
--

ALTER TABLE ONLY public."Cart"
    ADD CONSTRAINT "Cart_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: CheckoutItem CheckoutItem_checkoutSessionId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: karan
--

ALTER TABLE ONLY public."CheckoutItem"
    ADD CONSTRAINT "CheckoutItem_checkoutSessionId_fkey" FOREIGN KEY ("checkoutSessionId") REFERENCES public."CheckoutSession"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: CheckoutSession CheckoutSession_addressId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: karan
--

ALTER TABLE ONLY public."CheckoutSession"
    ADD CONSTRAINT "CheckoutSession_addressId_fkey" FOREIGN KEY ("addressId") REFERENCES public."Address"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: CheckoutSession CheckoutSession_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: karan
--

ALTER TABLE ONLY public."CheckoutSession"
    ADD CONSTRAINT "CheckoutSession_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: OrderItem OrderItem_orderId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: karan
--

ALTER TABLE ONLY public."OrderItem"
    ADD CONSTRAINT "OrderItem_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES public."Order"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Order Order_addressId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: karan
--

ALTER TABLE ONLY public."Order"
    ADD CONSTRAINT "Order_addressId_fkey" FOREIGN KEY ("addressId") REFERENCES public."Address"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Order Order_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: karan
--

ALTER TABLE ONLY public."Order"
    ADD CONSTRAINT "Order_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: Payment Payment_orderId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: karan
--

ALTER TABLE ONLY public."Payment"
    ADD CONSTRAINT "Payment_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES public."Order"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: ProductImage ProductImage_productId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: karan
--

ALTER TABLE ONLY public."ProductImage"
    ADD CONSTRAINT "ProductImage_productId_fkey" FOREIGN KEY ("productId") REFERENCES public."Product"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

\unrestrict 0ClhJ16MY9xpXrvm4fvLCLCfjE0vY7P4ASYBs6BaLhJYseipaniR41RBmVaz07R

