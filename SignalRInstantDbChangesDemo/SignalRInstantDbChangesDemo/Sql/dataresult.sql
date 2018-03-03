USE [ExperimentalDB]
GO

/****** Object:  Table [dbo].[DataResult]    Script Date: 24/02/2018 12:06:40 ******/
DROP TABLE [dbo].[DataResult]
GO

/****** Object:  Table [dbo].[DataResult]    Script Date: 24/02/2018 12:06:40 ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

SET ANSI_PADDING ON
GO

CREATE TABLE [dbo].[DataResult](
	[id] [varchar](10) NOT NULL,
	[Status] [varchar](50) NOT NULL,
	[message] [varchar](20) NULL,
	[Flag] [bit] default 0,
	[ModifiedDate] [datetime2]
 CONSTRAINT [PK_DataResult] PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]

GO

SET ANSI_PADDING OFF
GO

