CREATE NONCLUSTERED INDEX [IX_BatchType]
ON [dbo].[Batch] ([BatchType])
INCLUDE ([LineId],[GloveType],[Size],[BatchCardDate],[QCType])
GO