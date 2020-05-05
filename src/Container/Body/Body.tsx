import React, { useState, useEffect } from "react";
import {
  Fab,
  Container,
  FormGroup,
  FormControlLabel,
  Checkbox,
  TextField,
  Button,
} from "@material-ui/core";

import api from "../../../api.json";
import Blueprint from "../../Model/Blueprint";
import Article from "../../Component/Article";
import Spinner from "../../Component/Spinner";
import BlueprintFormData from "../../Model/BlueprintFormData";

export default () => {
  const [list, setList] = useState<Blueprint[]>([]);
  const [formData, setFormData] = useState<BlueprintFormData>({
    blueprints: [],
    name: "",
  });

  const [isValid, setIsValid] = useState<boolean>(false);

  useEffect(() => {
    if (list.length === 0) {
      fetch(api.list, {
        mode: "cors",
      })
        .then((res) => res.json())
        .then((json) => setList(json));
    }

    setIsValid(validate());
  }, [list, formData]);

  const onChangeTextField = (event: React.ChangeEvent) => {
    const target = event.target as HTMLInputElement;

    setFormData({ ...formData, name: target.value });
  };

  const onClickItemCheckbox = (event: React.ChangeEvent) => {
    const target = event.target as HTMLInputElement;

    const id = target.name;

    if (target.checked) {
      setFormData({
        ...formData,
        blueprints: [...formData.blueprints, id],
      });
    } else {
      setFormData({
        ...formData,
        blueprints: formData.blueprints.filter((itemId) => itemId !== id),
      });
    }
  };
  const validate = () => {
    return formData.blueprints.length !== 0 && formData.name.length !== 0;
  };

  const onClickSubmit = async () => {
    const res = await fetch(api.list, {
      mode: "cors",
      method: "POST",
      body: JSON.stringify(formData),
    });
    const json = await res.json();

    console.log(json);
  };

  return (
    <Container style={{ paddingBottom: "10px" }}>
      <FormGroup>
        <Article>
          <TextField
            required
            style={{ width: "100%" }}
            name="name"
            label="あなたのお名前"
            onChange={onChangeTextField}
          />
        </Article>
        <Article title="借りたい設計図を選んでね">
          {list.length === 0 ? (
            <Spinner />
          ) : (
            list.map((item) => (
              <FormControlLabel
                key={`${item.rare}${item.name} (${item.owner})`}
                label={`${item.rare}${item.name} (${item.owner})`}
                control={
                  <Checkbox
                    onChange={onClickItemCheckbox}
                    name={`${item.id}`}
                  />
                }
              />
            ))
          )}
        </Article>
      </FormGroup>

      <Fab
        variant="extended"
        style={{ position: "fixed", right: "5px", bottom: "5px" }}
        color={isValid ? "primary" : "default"}
        disabled={!isValid}
        onClick={onClickSubmit}
      >
        借りる
      </Fab>
    </Container>
  );
};
