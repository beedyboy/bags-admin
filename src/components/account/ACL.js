import React, { useEffect, useState, Fragment } from "react";
import { Checkbox } from "primereact/checkbox";
import { toJS } from "mobx";

const ACLForm = ({
  reset, 
  action,
  error,
  sending, 
  assignRole,
  toggle,
  initial_data,
}) => {
  const [uid, setId] = useState();
  const [priviledges, setPriviledges] = useState({
    brands: { add: false, view: false, del: false },
    category: { add: false, view: false, del: false },
    company: { manage: false },
    subscribers: { add: false, view: false, del: false },
    product: { add: false, view: false, del: false },
    staff: { add: false, view: false, del: false, modify: false },
    reconcillation: {
      upload: false,
      view: false,
      del: false,
      approval_one: false,
      approval_two: false,
      modify: false,
      report: false,
    },
    report: { manage: false },
  });

  useEffect(() => {
    const test = toJS(initial_data && initial_data.acl);
    const id = initial_data && initial_data.id;
    setId(id);
    if (test && test.length > 0) {
      const data = initial_data && initial_data.acl[0];
      setPriviledges((state) => ({
        ...state,
        brands: {
          add: (data && data.brands.add) || false,
          view: (data && data.brands.view) || false,
          del: (data && data.brands.del) || false,
        },
        category: {
          add: (data && data.category.add) || false,
          view: (data && data.category.view) || false,
          del: (data && data.category.del) || false,
        },
        company: {
          manage: (data && data.company.manage) || false,
        },
        subscribers: {
          add: (data && data.subscribers.add) || false,
          view: (data && data.subscribers.view) || false,
          del: (data && data.subscribers.del) || false,
        },
        product: {
          add: (data && data.product.add) || false,
          view: (data && data.product.view) || false,
          del: (data && data.product.del) || false,
        },
        staff: {
          add: (data && data.staff.add) || false,
          view: (data && data.staff.view) || false,
          del: (data && data.staff.del) || false,
          modify: (data && data.staff.modify) || false,
        },
        reconcillation: {
          view:
            (data && data.reconcillation && data.reconcillation.view) || false,
          del:
            (data && data.reconcillation && data.reconcillation.del) || false,
          approval_one: (data && data.reconcillation.approval_one) || false,
          approval_two: (data && data.reconcillation.approval_two) || false,
          modify: (data && data.reconcillation.modify) || false,
          upload: (data && data.reconcillation.upload) || false,
          report: (data && data.reconcillation.report) || false,
        },
        report: {
          manage: (data && data.report.manage) || false,
        },
      }));
    }
  }, [initial_data]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const roleData = {
      priviledges,
      id: uid,
    };
    assignRole(roleData);
  };
  const handleRoleChange = (event, role) => {
    event.persist();
    setPriviledges((formState) => ({
      ...formState,
      [role]: {
        ...formState[role],
        [event.target.name]: event.target.checked,
      },
    }));
  };

  useEffect(() => {
    if (action === "hasRole") {
      resetForm();
      toggle(false);
    }
    return () => {
      reset("saved", false);
      reset("message", "");
      resetForm();
      toggle(false);
    };
  }, [action]);

  useEffect(() => {
    if (error === true && action === "hasRoleError") {
    }
    return () => {
      reset("error", false);
      reset("message", "");
      resetForm();
      toggle(false);
    };
  }, [error]);

  const resetForm = () => {
    setPriviledges((prev) => ({
      ...prev,
      values: {
        ...prev.values,
        brands: { add: false, view: false, del: false },
        category: { add: false, view: false, del: false },
        company: { manage: false },
        subscribers: { add: false, view: false, del: false },
        product: { add: false, view: false, del: false },
        staff: { add: false, view: false, del: false, modify: false },
        reconcillation: {
          upload: false,
          view: false,
          del: false,
          approval_one: false,
          approval_two: false,
          modify: false,
          report: false,
        },
        report: { manage: false },
      },
    }));
  };
  return (
    <Fragment>
      <div className="p-grid">
        <div className="p-col-12">
          <div className="card p-fluid">
            <div className="p-d-flex p-flex-column p-flex-md-row">
              <div>Brand</div>
              <div className="p-field-checkbox">
                <Checkbox
                  inputId="add"
                  name="add"
                  checked={priviledges.brands.add || false}
                  onChange={(event) => handleRoleChange(event, "brands")}
                />
                <label htmlFor="add">Add</label>
              </div>

              <div className="p-field-checkbox">
                <Checkbox
                  inputId="view"
                  name="view"
                  checked={priviledges.brands.view || false}
                  onChange={(event) => handleRoleChange(event, "brands")}
                />
                <label htmlFor="view">View</label>
              </div>

              <div className="p-field-checkbox">
                <Checkbox
                  inputId="del"
                  name="del"
                  checked={priviledges.brands.del || false}
                  onChange={(event) => handleRoleChange(event, "brands")}
                />
                <label htmlFor="del">Del</label>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* <Box>
          <FormControl id="branch">
            <FormLabel>Branch</FormLabel>
            <Wrap spacing="20px">
              <WrapItem>
                <Checkbox
                  isChecked={priviledges.branch.add || false}
                  name="add"
                  onChange={(event) => handleRoleChange(event, "branch")}
                >
                  Add
                </Checkbox>
              </WrapItem>
              <WrapItem>
                <Checkbox
                  isChecked={priviledges.branch.view || false}
                  name="view"
                  onChange={(event) => handleRoleChange(event, "branch")}
                >
                  View
                </Checkbox>
              </WrapItem>
              <WrapItem>
                <Checkbox
                  isChecked={priviledges.branch.del || false}
                  name="del"
                  onChange={(event) => handleRoleChange(event, "branch")}
                >
                  Del
                </Checkbox>
              </WrapItem>
            </Wrap>
          </FormControl>
        </Box>
       */}
    </Fragment>
  );
};

export default ACLForm;
