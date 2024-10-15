CREATE TABLE IF NOT EXISTS "senders" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(255) NOT NULL,
	"dialing_country_code" varchar(2) NOT NULL,
	"phone" varchar(20) NOT NULL,
	"email" varchar(255),
	"address_1" text NOT NULL,
	"address_2" text,
	"postcode" varchar(5) NOT NULL,
	"province" varchar(255) NOT NULL,
	"city" varchar(255) NOT NULL,
	"country" varchar(2) NOT NULL
);
