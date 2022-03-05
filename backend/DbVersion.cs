using System;
using System.Collections.Generic;

namespace WebApi
{
    public partial class DbVersion
    {
        public Guid Id { get; set; }
        public string DbVersion1 { get; set; }
        public DateTime InstallDate { get; set; }
        public string Notes { get; set; }
    }
}
