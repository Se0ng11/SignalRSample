CREATE NONCLUSTERED INDEX [IX_QCType]
ON [dbo].[QAI] ([QCType],[QAIChangeReason],[QITestResult],[ResamplingCount],[ChangeQCTypeReason])
INCLUDE ([SerialNumber],[BatchNumber])