using System.Data;
using System.Data.SqlClient;

namespace SignalRInstantDbChangesDemo.DataAccess
{
    public delegate void ResultChangedEventHandler(object sender, SqlNotificationEventArgs e);
    public class NewMessageNotifier
    {
        #region Fields
        public event ResultChangedEventHandler NewMessage;
        string _connString;
        string _selectQuery;

        #endregion

        internal NewMessageNotifier(string connString, string selectQuery)
        {
            _connString = connString;
            _selectQuery = selectQuery;
            RegisterForNotifications();
        }

        private void RegisterForNotifications()
        {
            using (var connection = new SqlConnection(_connString))
            {
                using (SqlCommand command = new SqlCommand(_selectQuery, connection))
                {
                    command.Notification = null;
                    SqlDependency dependency = new SqlDependency(command);
                    dependency.OnChange += new OnChangeEventHandler(Dependency_OnChange);
                    if (connection.State == ConnectionState.Closed)
                        connection.Open();
                    var Reader = command.ExecuteReader();
                }
            }
        }
        private void Dependency_OnChange(object sender, SqlNotificationEventArgs e)
        {
            if (NewMessage != null)
                NewMessage(sender, e);
            RegisterForNotifications();
        }
    }
}