-- Create Tony Stark Record
INSERT INTO public.account (account_firstname, account_lastname, account_email, account_password) VALUES (
	'Tony', 
	'Stark',
	'tony@starkent.com',
	'Iam1ronM@n'
);
-- Update Account Type
UPDATE public.account
	SET account_type = 'Admin'
	WHERE account_id = 1;
-- Update Description
UPDATE public.inventory
	SET inv_description = REPLACE(inv_description, 'the small interiors', 'a huge interior')
	WHERE inv_make = 'GM' AND inv_model = 'Hummer';
-- Inner Join
SELECT inv_make, inv_model, classification_name FROM public.inventory
	JOIN public.classification USING(classification_id)
	WHERE classification_id = 2;
-- Update Image Paths
UPDATE public.inventory
	SET inv_image = REPLACE(inv_image, 'images/', 'images/vehicles/'),
	inv_thumbnail = REPLACE(inv_thumbnail, 'images/', 'images/vehicles/');


a 