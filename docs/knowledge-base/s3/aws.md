---
title: Aws S3 Backup Setup
description: "Set up automated Coolify backups with AWS S3 including IAM policy creation, bucket configuration, access key setup, and cost-effective lifecycle rules."
---


<ZoomableImage src="/docs/images/aws-s3/header.webp" alt="Coolify header" />

Coolify offers automated backups of your instance to an AWS S3 bucket, giving you a hands‑off, reliable way to safeguard your configuration and data.

### Why use AWS S3 with Coolify?  
1. **Enterprise‑grade durability & availability:** S3 is designed for 99.999999999% durability and automatic replication across multiple facilities, so your backups are always safe and accessible.  

2. **Cost‑effective, pay as you go pricing:** Only pay for the storage and requests you actually use, with built‑in lifecycle rules (e.g., transition to Glacier) to optimize long‑term costs.  

3. **Seamless integration** – Coolify’s backup scheduler hooks directly into S3’s API, eliminating the need for custom scripts or third‑party tools and ensuring backups run on a schedule.  


### When to avoid using AWS S3 with Coolify?  
1. **Strict data residency or on‑prem requirements:** If your regulations mandate keeping backups entirely within a private data center, S3’s public cloud model may not comply.  

2. **No external network access:** In environments where outbound internet is blocked, Coolify cannot push snapshots to an S3 endpoint.  

---


::: warning Example Data
The following data is used as an example in this guide. Please replace it with your actual data when following the steps:
  - **S3 Bucket Name:** envix-coolify-backups-s3
  - **IAM Policy Name:** EnvixCoolifyBackupS3Access
  - **IAM Username:** EnvixCoolifyBackupS3User
  - **Endpoint:** https://s3.ap-northeast-2.amazonaws.com
:::

---

::: details TLDR (click to view)
1. Create a bucket in AWS Console
2. Create a custom policy in AWS Console with the following permissions:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "s3:ListBucket",
        "s3:GetObject",
        "s3:DeleteObject",
        "s3:GetObjectAcl",
        "s3:PutObjectAcl",
        "s3:PutObject"
      ],
      "Resource": [
        // rewrite your-bucket-name with your bucket name
        "arn:aws:s3:::your-bucket-name",
        "arn:aws:s3:::your-bucket-name/*"
      ]
    }
  ]
}
```

3. Create an IAM user in AWS Console & attach the policy from the previous step.
4. Go to User settings & create an `Access Key` in AWS Console.
5. Add the `Access Key` and `Secret Key` in Coolify when you create a new S3 source.
   ::: success Tip
     You need to use the S3 HTTP endpoint without the bucket name, for example,`https://s3.eu-central-1.amazonaws.com`.
:::


## 1. Create a S3 Bucket
To create your S3 Bucket, follow these steps:

Visit https://console.aws.amazon.com/s3 and Click on **Create Bucket** button

<ZoomableImage src="/docs/images/aws-s3/1.webp" alt="Screenshot of Aws" />

You’ll be asked to choose a name, object ownership, and so on.

<ZoomableImage src="/docs/images/aws-s3/2.webp" alt="Screenshot of Aws" />

::: info Note
Leave everything else to default values, only change things if you know what you are doing.
:::

<ZoomableImage src="/docs/images/aws-s3/3.webp" alt="Screenshot of Aws" />
<br />
<ZoomableImage src="/docs/images/aws-s3/4.webp" alt="Screenshot of Aws" />
<br />
<ZoomableImage src="/docs/images/aws-s3/5.webp" alt="Screenshot of Aws" />

Click on **Create Bucket** button

Once the bucket is created you will be redirected to this page:
<ZoomableImage src="/docs/images/aws-s3/6.webp" alt="Screenshot of Aws" />


## 2. Create IAM Policy
To create your IAM Policy, follow these steps:

Visit https://console.aws.amazon.com/iam/home#/policies and Click on **Create Policy** button
<ZoomableImage src="/docs/images/aws-s3/7.webp" alt="Screenshot of Aws" />
<br />
<ZoomableImage src="/docs/images/aws-s3/8.webp" alt="Screenshot of Aws" />

  - Click on **JSON** option and copy paste the following code on the policy editor 
```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "s3:ListBucket",
        "s3:GetObject",
        "s3:DeleteObject",
        "s3:GetObjectAcl",
        "s3:PutObjectAcl",
        "s3:PutObject"
      ],
      "Resource": [
        // replace envix-coolify-backups-s3 with your bucket name on below two lines
        "arn:aws:s3:::envix-coolify-backups-s3",
        "arn:aws:s3:::envix-coolify-backups-s3/*"
      ]
    }
  ]
}
```

Scroll down till the bottom of the page and click on the **Continue** button.

Then you’ll be asked to choose a name for the policy:
<ZoomableImage src="/docs/images/aws-s3/9.webp" alt="Screenshot of Aws" />

Once you have entered the name, scroll down till the bottom of the page and click on the **Continue** button.

Once the Policy is created you will be redirected to this page:
<ZoomableImage src="/docs/images/aws-s3/10.webp" alt="Screenshot of Aws" />
::: success Tip
You won't see the policy you just created, you have to search for it's name on the search box.
:::


## 3. Create a IAM User
To create your IAM User, follow these steps:

Visit https://console.aws.amazon.com/iam/home#/users and Click on **Create user** button
<ZoomableImage src="/docs/images/aws-s3/11.webp" alt="Screenshot of Aws" />

You’ll be asked to choose a name for the user:
<ZoomableImage src="/docs/images/aws-s3/12.webp" alt="Screenshot of Aws" />
  - Click on **Next** button after you have entered a name for the user.

<ZoomableImage src="/docs/images/aws-s3/13.webp" alt="Screenshot of Aws" />
1. Select Attach policies directly option
2. Select the policy we created on the previous step
3. Click on **Next** button

<ZoomableImage src="/docs/images/aws-s3/14.webp" alt="Screenshot of Aws" />
  - Click on **Create user** button (you don't have to change anything on this page />

Once the Policy is created you will be redirected to this page:
<ZoomableImage src="/docs/images/aws-s3/15.webp" alt="Screenshot of Aws" />
  - Click on the username to create an access key.


## 4. Create an Access Key
After you have clicked on the username on previous step, you will be redirect to this page:
<ZoomableImage src="/docs/images/aws-s3/16.webp" alt="Screenshot of Aws" />
  - Click on **Create access key** option to setup a new access key.

<ZoomableImage src="/docs/images/aws-s3/17.webp" alt="Screenshot of Aws" />
  - Choose the **Other** option and click on **Continue** button

<ZoomableImage src="/docs/images/aws-s3/18.webp" alt="Screenshot of Aws" />
  - Click on **Create access key** button.

<ZoomableImage src="/docs/images/aws-s3/19.webp" alt="Screenshot of Aws" />
  - Save the Access Key and Secrete Access Key somewhere safe and click on **Done** button
  ::: warning Note
  You won't able able to see the access key after you click the **Done** button, so make sure to save the keys somewhere safe.
  :::


## 5. Setup S3 in Coolify
To create your setup S3 in Coolify, follow these steps:

In your Coolify dashboard:
<ZoomableImage src="/docs/images/aws-s3/20.webp" alt="Screenshot of Aws" />

1. Go to the **Storage** section in the sidebar.
2. Click **Add** button

<ZoomableImage src="/docs/images/aws-s3/21.webp" alt="Screenshot of Aws" />

1. Give a name for the S3 storage (this can be any name)
2. Give a short description for the storage (optional)
3. Enter the endpoint without your bucket name: `https://s3.YOUR_REGION_NAME.amazonaws.com`
4. Enter the name of the S3 bucket you created.
5. Enter your S3 bucket's region
6. Enter your Access Key
7. Enter your Secret Access Key
8. Click on **Validate Connection & Continue** button

Once the Bucket is validated you will be redirected to this page:
<ZoomableImage src="/docs/images/aws-s3/22.webp" alt="Screenshot of Aws" />

Then go to **settings** page and click on **Backup**
<ZoomableImage src="/docs/images/aws-s3/23.webp" alt="Screenshot of Aws" />
<br />
<ZoomableImage src="/docs/images/aws-s3/24.webp" alt="Screenshot of Aws" />

1. Enable S3
2. Select your S3 storage
3. Select the frequency of the backup (you can use this [website](https://www.convertloom.com/tools/cron-job-generator) if you are new to cron)
4. Setup Backup Retentions
5. Click on **Backup Now** button (just to check if everything works)

You can see the backups stored on your S3 from the execution logs:
<ZoomableImage src="/docs/images/aws-s3/25.webp" alt="Screenshot of Aws" />

Now you’re done! Your Coolify instance is set up to automatically backup and store them on your Aws S3 bucket safely.
